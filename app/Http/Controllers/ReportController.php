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
        return Inertia::render("Report/ReportPage", [
            "report" => Laporan::latest()->get(),
        ]
        );
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
        'petugas_lapangan' => 'required|exists:users,id',
        'latitude' => 'required|numeric',
        'longitude' => 'required|numeric',
        'nama_mitra' => 'required|exists:mitra,id',
    ]);

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
            return response()->json([
                'success' => false,
                'message' => 'Data laporan tidak ditemukan'
            ], 404);
        }

        $validated = $request->validate([
            'tanggal' => 'required|date',
            'deskripsi' => 'required',
            'status_laporan' => 'required',
            'tipe_tiang' => 'required',
            'lokasi' => 'required',
            'petugas_lapangan' => 'required|exists:users,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'nama_mitra' => 'required|exists:mitra,id',
        ]);

        $laporan->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data laporan berhasil diupdate',
            'data' => $laporan
        ], 200);
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
