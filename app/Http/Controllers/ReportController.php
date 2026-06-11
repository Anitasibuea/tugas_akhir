<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Laporan;
use  Inertia\Inertia;
use App\Models\User;
use App\Models\Mitra;
use Illuminate\Support\Str;

class ReportController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $query = Laporan::query();

     // If user has role 'mitra', filter reports by their own company name
    if ($user->roles->contains('name', 'mitra')) {
        // Get the Mitra record linked to this user
        // Choose the correct option based on your schema:

        // Option 1: If users table has 'mitra_id' column
        $mitra = $user->mitra_id ? Mitra::find($user->mitra_id) : null;

        // Option 2: If mitras table has 'petugas_mapping' column (user_id)
        // $mitra = Mitra::where('petugas_mapping', $user->id)->first();

        if ($mitra) {
            // Filter by the exact company name stored in laporan.nama_mitra
            $query->where('nama_mitra', $mitra->nama_perusahaan);
        } else {
            // No mitra linked → return empty result
            $query->whereRaw('1 = 0');
        }
    
    }

    return Inertia::render("Report/ReportPage", [
        "report" => Laporan::latest()->get(),
        'petugasUsers' => User::role('petugas')->select('id', 'name')->get(),
        'mitraUsers' => Mitra::select('id', 'nama_perusahaan')->get(),
    ]);
    }
    /**
     * Menampilkan semua data laporan
     */
    public function index2()
        {
            return Inertia::render("Report/Addreport", [
                // ONLY USERS WITH ROLE MITRA
                'petugasUsers' => User::role('petugas')
                    ->select('id', 'name')
                    ->get(),
                'mitraUsers' => Mitra::select('id', 'nama_perusahaan')
    ->get(),
            ]);
        }

    public function pdf($id)
    {
        $report = Laporan::findOrFail($id);
        return Inertia::render('Report/PDF',  ['report' => $report]);
    }

    /**
     * Menyimpan data laporan baru
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'tanggal' => 'required|date',
        'deskripsi' => 'required',
        'status_laporan' => 'required',
        'tipe_tiang' => 'required',
        'lokasi' => 'required',
        'jenis_kabel' => 'required',
        'jumlah_kabel' => 'required',
        'panjang_tiang' => 'required',
        'petugas_lapangan' => 'required|exists:users,id',
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
        'nama_mitra' => 'required|exists:mitra,id',
        'foto' => 'required|file|mimes:pdf,jpeg,jpg,png|max:5120'
    ]);

    $petugas = User::find($validated['petugas_lapangan']);
    $mitra = Mitra::find($validated['nama_mitra']);

    $validated['petugas_lapangan'] = $petugas->name;
    $validated['nama_mitra'] = $mitra->nama_perusahaan;
    $validated['foto'] = $request->file('foto')->store('dokumen/foto', 'public');
    
    /* GET CURRENT YEAR */
    $year = date('Y');

    /* GET LAST REPORT THIS YEAR */
    $lastReport = Laporan::where('id', 'like', "PLN-$year-%")
        ->orderBy('id', 'desc')
        ->first();

    /* DEFAULT NUMBER */
    $number = 1;

    /* IF DATA EXISTS */
    if ($lastReport) {

        /*
        Example:
        PLN-2025-089
        */

        $lastNumber = (int) substr($lastReport->id, -3);

        $number = $lastNumber + 1;
    }

    /* GENERATE NEW ID */
    $generatedId = 'PLN-' . $year . '-' . str_pad($number, 3, '0', STR_PAD_LEFT);

    /* ADD TO VALIDATED DATA */
    $validated['id'] = $generatedId;

    /* CREATE REPORT */
    Laporan::create($validated);

    return redirect()->back()->with(
        'success',
        'Data laporan berhasil ditambahkan'
    );
}
    /**
     * Menampilkan detail laporan berdasarkan ID
     */
    public function show($id)
    {
        $laporan = Laporan::find($id);

        if (!$laporan) {
            return response()->json([
                'success' => false,
                'message' => 'Data laporan tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $laporan
        ], 200);
    }

    /**
     * Mengupdate data laporan
     */
    public function update(Request $request, $id)
{
    $laporan = Laporan::find($id);

    if (!$laporan) {
        return redirect()->back()->with('error', 'Data laporan tidak ditemukan');
    }

    $validated = $request->validate([
        'tanggal' => 'required|date',
        'deskripsi' => 'required',
        'status_laporan' => 'required',
        'tipe_tiang' => 'required',
        'lokasi' => 'required',
        'jenis_kabel' => 'required',
        'jumlah_kabel' => 'required',
        'panjang_tiang' => 'required',
        'petugas_lapangan' => 'required|exists:users,id',
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
        'nama_mitra' => 'required|exists:mitra,id',
    ]);

    // Get the actual names from the IDs
    $petugas = User::find($validated['petugas_lapangan']);
    $mitra = Mitra::find($validated['nama_mitra']);

    // Replace IDs with actual names
    $validated['petugas_lapangan'] = $petugas->name;
    $validated['nama_mitra'] = $mitra->nama_perusahaan;

    $laporan->update($validated);

    return redirect()->back()->with('success', 'Data laporan berhasil diupdate');
}

    /**
     * Menghapus data laporan
     */
public function destroy($id)
{
    $laporan = Laporan::find($id);

    if (!$laporan) {
        return redirect()->back()->with('error', 'Data laporan tidak ditemukan');
    }

    $laporan->delete();

    return redirect()->back()->with('success', 'Data laporan berhasil dihapus');
}

 public function generateQrForManajer($id)
    {
        $laporan = Laporan::findOrFail($id);
        $user = auth()->user();

        abort_unless($user->roles->contains('name', 'manajer') || $user->roles->contains('name', 'admin'), 403);
        abort_if($laporan->isManajerSigned(), 409, 'Manajer already signed.');

        $token = Str::random(64);
        $laporan->update(['signature_qr_manajer' => $token]);

        return back()->with([
            'success' => 'QR token generated for Manajer.',
            'qr_token' => $token,
        ]);
    }

 public function generateQrForMitra($id)
    {
        $laporan = Laporan::findOrFail($id);
        $user = auth()->user();

        if ($laporan->isMitraSigned()) {
            return back()->with('error', 'Laporan sudah ditandatangani Mitra.');
        }

        if (!$laporan->isManajerSigned()) {
            return back()->with('error', 'Manajer harus menandatangani terlebih dahulu sebelum Mitra.');
        }

        // Optional: cek status Selesai
        // if ($laporan->status_laporan !== 'Selesai') {
        //     return back()->with('error', 'Laporan harus berstatus Selesai.');
        // }

        $token = Str::random(64);
        $laporan->update(['signature_qr_mitra' => $token]);

        return back()->with([
            'success' => 'QR Code untuk Mitra berhasil dibuat.',
            'qr_token' => $token,
        ]);
    }

    // ─── Mitra signs using the QR token ─────────────────────────────────────
    public function signMitraWithToken(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'report_id' => 'required|exists:report,id',
            'signature_data' => 'required|string', // base64 drawn signature
        ]);

        $laporan = Laporan::where('id', $request->report_id)
            ->where('signature_qr_mitra', $request->token)
            ->firstOrFail();

        abort_if($laporan->isMitraSigned(), 409, 'Report already signed by Mitra.');

        $laporan->update([
            'signed_by_mitra' => auth()->id(),
            'signed_at_mitra' => now(),
            'signature_data' => $request->signature_data,   // store the drawn signature
            'signature_qr_mitra' => null,                   // invalidate token after use
        ]);

        return response()->json(['message' => 'Signed successfully as Mitra']);
    }

    public function signManajerWithToken(Request $request)
{
    $request->validate([
        'token' => 'required|string',
        'report_id' => 'required|exists:report,id',
        'signature_data' => 'required|string',
    ]);

    $laporan = Laporan::where('id', $request->report_id)
        ->where('signature_qr_manajer', $request->token)
        ->firstOrFail();

    abort_if($laporan->isManajerSigned(), 409, 'Already signed by Manajer.');

    $laporan->update([
        'signed_by_manajer' => auth()->id(),
        'signed_at_manajer' => now(),
        'signature_data_manajer' => $request->signature_data,
        'signature_qr_manajer' => null,
    ]);

    // After manajer signs, you may automatically generate a QR for mitra? Not required.
    return response()->json(['message' => 'Manajer signed successfully']);
}


    // ─── (Optional) Verify QR token (for the Mitra signing page) ───────────
    public function verifyQr(string $token)
    {
        $laporan = Laporan::where('signature_qr_mitra', $token)->firstOrFail();
        return Inertia::render('Report/VerifyQr', [
            'laporan' => $laporan->only('id', 'nama_mitra', 'tanggal'),
        ]);
    }
}

