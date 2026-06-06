<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Laporan;
use  Inertia\Inertia;
use App\Models\User;
use App\Models\Mitra;

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
}
