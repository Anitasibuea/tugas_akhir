<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Laporan;
use  Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Menampilkan semua data laporan
     */
    public function index()
    {
        return Inertia::render("Report/Addreport", [
            "report" => Laporan::latest()->get(),
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
            'petugas_mitra' => 'required',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'nama_mitra' => 'required'
        ]);

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
            'petugas_mitra' => 'required',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'nama_mitra' => 'required'
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
            return response()->json([
                'success' => false,
                'message' => 'Data laporan tidak ditemukan'
            ], 404);
        }

        $laporan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data laporan berhasil dihapus'
        ], 200);
    }
}
