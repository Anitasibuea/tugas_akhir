<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Laporan;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Mitra;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = Laporan::query();

        if ($user->roles->contains('name', 'mitra')) {
            $mitra = Mitra::where('petugas_mapping', $user->id)->first(); // ← fix this
            if ($mitra) {
                $query->where('nama_mitra', $mitra->nama_perusahaan);
            } else {
                $query->whereRaw('1 = 0');
            }
        }

        return Inertia::render("Report/ReportPage", [
            "report" => $query->latest()->get(),
            'petugasUsers' => User::role('petugas')->select('id', 'name')->get(),
            'mitraUsers'   => Mitra::select('id', 'nama_perusahaan')->get(),
        ]);
    }

    public function index2()
    {
        return Inertia::render("Report/Addreport", [
            'petugasUsers' => User::role('petugas')->select('id', 'name')->get(),
            'mitraUsers'   => Mitra::all(),
        ]);
    }

    public function pdf($id)
    {
        $report = Laporan::findOrFail($id);

        $manajerName = $report->signed_by_manajer
            ? User::find($report->signed_by_manajer)?->name ?? 'Manajer'
            : 'Manajer';
        $mitraName = $report->signed_by_mitra
            ? User::find($report->signed_by_mitra)?->name ?? 'Mitra'
            : 'Mitra';
        return Inertia::render('Report/PDF', [
            'report'      => $report,
            'manajerName' => $manajerName,
            'mitraName'   => $mitraName
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal'          => 'required|date',
            'deskripsi'        => 'required',
            'status_laporan'   => 'required',
            'tipe_tiang'       => 'required',
            'lokasi'           => 'required',
            'jenis_kabel'      => 'required',
            'jumlah_kabel'     => 'required',
            'panjang_tiang'    => 'required',
            'petugas_lapangan' => 'required|exists:users,id',
            'awal_kontrak'     => 'required|date',
            'akhir_kontrak'    => 'required|date',
            'latitude'         => 'required|numeric',
            'longitude'        => 'required|numeric',
            'nama_mitra'       => 'required|exists:mitra,id',
            'foto'             => 'required|file|mimes:pdf,jpeg,jpg,png|max:5120',
        ]);

        $petugas = User::find($validated['petugas_lapangan']);
        $mitra   = Mitra::find($validated['nama_mitra']);

        $validated['petugas_lapangan'] = $petugas->name;
        $validated['nama_mitra']       = $mitra->nama_perusahaan;
        $validated['foto']             = $request->file('foto')->store('dokumen/foto', 'public');

        $year       = date('Y');
        $lastReport = Laporan::where('id', 'like', "PLN-$year-%")->orderBy('id', 'desc')->first();
        $number     = $lastReport ? ((int) substr($lastReport->id, -3)) + 1 : 1;

        $validated['id'] = 'PLN-' . $year . '-' . str_pad($number, 3, '0', STR_PAD_LEFT);

        Laporan::create($validated);

        return redirect()->back()->with('success', 'Data laporan berhasil ditambahkan');
    }

    public function show($id)
    {
        $laporan = Laporan::find($id);

        if (!$laporan) {
            return response()->json(['success' => false, 'message' => 'Data laporan tidak ditemukan'], 404);
        }

        return response()->json(['success' => true, 'data' => $laporan], 200);
    }

    public function update(Request $request, $id)
    {
        $laporan = Laporan::find($id);

        if (!$laporan) {
            return redirect()->back()->with('error', 'Data laporan tidak ditemukan');
        }

        $validated = $request->validate([
            'tanggal'          => 'required|date',
            'deskripsi'        => 'required',
            'status_laporan'   => 'required',
            'tipe_tiang'       => 'required',
            'lokasi'           => 'required',
            'jenis_kabel'      => 'required',
            'jumlah_kabel'     => 'required',
            'panjang_tiang'    => 'required',
            'petugas_lapangan' => 'required|exists:users,id',
            'awal_kontrak'     => 'required|date',
            'akhir_kontrak'    => 'required|date',
            'latitude'         => 'required|numeric',
            'longitude'        => 'required|numeric',
            'nama_mitra'       => 'required|exists:mitra,id',
        ]);

        $petugas = User::find($validated['petugas_lapangan']);
        $mitra   = Mitra::find($validated['nama_mitra']);

        $validated['petugas_lapangan'] = $petugas->name;
        $validated['nama_mitra']       = $mitra->nama_perusahaan;

        $laporan->update($validated);

        return redirect()->back()->with('success', 'Data laporan berhasil diupdate');
    }

    public function destroy($id)
    {
        $laporan = Laporan::find($id);

        if (!$laporan) {
            return redirect()->back()->with('error', 'Data laporan tidak ditemukan');
        }

        $laporan->delete();

        return redirect()->back()->with('success', 'Data laporan berhasil dihapus');
    }

    /* ── Generate QR ──────────────────────────────────────── */

    public function generateQrForManajer($id)
    {
        $laporan = Laporan::findOrFail($id);
        $user    = auth()->user();

        abort_unless(
            $user->roles->contains('name', 'manajer') || $user->roles->contains('name', 'admin'),
            403
        );

        if ($laporan->isManajerSigned()) {
            return back()->with('error', 'Laporan sudah ditandatangani oleh Manajer.');
        }

        $token = Str::random(64);
        $laporan->update([
            'signature_qr_manajer' => $token,
            'signed_by_manajer'    => $user->id,   // ← add this
            'signed_at_manajer'    => now(),        // ← add this
        ]);

        return back()->with('success', 'QR Code untuk Manajer berhasil dibuat.');
    }

    public function generateQrForMitra($id)
    {
        $laporan = Laporan::findOrFail($id);
        $user    = auth()->user();

        abort_unless(
            $user->roles->contains('name', 'mitra') || $user->roles->contains('name', 'admin'),
            403
        );

        if ($laporan->isMitraSigned()) {
            return back()->with('error', 'Laporan sudah ditandatangani Mitra.');
        }

        if (!$laporan->isManajerSigned()) {
            return back()->with('error', 'Manajer harus menandatangani terlebih dahulu.');
        }

        $token = Str::random(64);
        $laporan->update([
            'signature_qr_mitra' => $token,
            'signed_by_mitra'    => $user->id,  // ← add
            'signed_at_mitra'    => now(),      // ← add
        ]);

        return back()->with('success', 'QR Code untuk Mitra berhasil dibuat.');
    }

    /* ── Sign with token (dipanggil dari halaman verifikasi) ─ */

    public function signManajerWithToken(Request $request)
    {
        $request->validate([
            'token'          => 'required|string',
            'report_id'      => 'required|exists:report,id',
            'signature_data' => 'required|string',
        ]);

        $laporan = Laporan::where('id', $request->report_id)
            ->where('signature_qr_manajer', $request->token)
            ->firstOrFail();

        abort_if($laporan->isManajerSigned(), 409, 'Already signed by Manajer.');

        $laporan->update([
            'signed_by_manajer'      => auth()->id(),
            'signed_at_manajer'      => now(),
            'signature_data_manajer' => $request->signature_data,
            'signature_qr_manajer'   => null,
        ]);

        return redirect()->back()->with('success', 'Laporan berhasil ditandatangani oleh Manajer.');
    }

    public function signMitraWithToken(Request $request)
    {
        $request->validate([
            'token'          => 'required|string',
            'report_id'      => 'required|exists:report,id',
            'signature_data' => 'required|string',
        ]);

        $laporan = Laporan::where('id', $request->report_id)
            ->where('signature_qr_mitra', $request->token)
            ->firstOrFail();

        abort_if($laporan->isMitraSigned(), 409, 'Report already signed by Mitra.');

        $laporan->update([
            'signed_by_mitra'  => auth()->id(),
            'signed_at_mitra'  => now(),
            'signature_data'   => $request->signature_data,
            'signature_qr_mitra' => null,
        ]);

        return redirect()->back()->with('success', 'Laporan berhasil ditandatangani oleh Mitra.');
    }

    /* ── Verify QR (halaman scan) ─────────────────────────── */

    public function verifyQr(string $token)
    {
        // Check manajer token first, then mitra
        $laporan = Laporan::where('signature_qr_manajer', $token)
            ->orWhere('signature_qr_mitra', $token)
            ->firstOrFail();

        $isManajer = $laporan->signature_qr_manajer === $token;

        $signer = $isManajer
            ? User::find($laporan->signed_by_manajer)
            : User::find($laporan->signed_by_mitra);

        return Inertia::render('Report/VerifyQr', [
            'laporan' => [
                'id'          => $laporan->id,
                'tanggal'     => $laporan->tanggal,
            ],
            'signer' => [
                'role'      => $isManajer ? 'Manajer PLN' : 'Petugas Mitra',
                'name'      => $signer?->name ?? '-',
                'signed_at' => $isManajer ? $laporan->signed_at_manajer : $laporan->signed_at_mitra,
            ],
            'verified' => true,
        ]);
    }
}
