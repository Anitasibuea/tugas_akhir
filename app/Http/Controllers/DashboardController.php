<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Laporan;
use App\Models\Mitra;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Menggunakan huruf kecil standar untuk user()
        $user = auth()->user();

        // Mendapatkan nama tabel secara dinamis dari Model Laporan
        $tableName = (new Laporan())->getTable();

        // Get total counts
        $totalTiang = Laporan::distinct('lokasi')->count('lokasi');
        $totalKabel = Laporan::sum('jumlah_kabel');

        // Get status counts
        $statusWaiting = Laporan::where('status_laporan', 'Proses')->count();
        $statusResolved = Laporan::where('status_laporan', 'Selesai')->count();

        // Get cable per tiang (group by location)
        $cablePerTiang = Laporan::select(
            'lokasi as name',
            DB::raw('COUNT(*) as total'),
            // Mengganti 'report' dengan nama tabel dinamis $tableName
            DB::raw("(COUNT(*) / (SELECT COUNT(*) FROM {$tableName}) * 100) as percentage")
        )
            ->groupBy('lokasi')
            ->orderBy('total', 'desc') // Diurutkan agar top 5 lebih relevan
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'total' => $item->total,
                    'percentage' => round($item->percentage, 1)
                ];
            });

        // Get status distribution
        $totalReports = Laporan::count();
        $statusDistribution = [
            'waiting' => $totalReports > 0 ? round(($statusWaiting / $totalReports) * 100, 1) : 0,
            'resolved' => $totalReports > 0 ? round(($statusResolved / $totalReports) * 100, 1) : 0,
        ];

        // Get recent activities
        $recentActivities = Laporan::latest()
            ->take(5)
            ->get()
            ->map(function ($report) {
                return [
                    'description' => "Laporan #{$report->id} - {$report->status_laporan} - {$report->deskripsi}",
                    'time' => $report->created_at ? $report->created_at->diffForHumans() : 'Just now'
                ];
            });

        // Get quick access stats
        $stats = [
            'totalTiang' => $totalTiang,
            'totalKabel' => $totalKabel,
            'statusWaiting' => $statusWaiting,
            'statusResolved' => $statusResolved,
        ];

        // Get user-specific data if needed
        $mitraData = null;
        if ($user && $user->roles && $user->roles->contains('name', 'mitra')) {
            $mitraData = Mitra::where('petugas_mapping', $user->id)->first();
        }

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentActivities' => $recentActivities,
            'cablePerTiang' => $cablePerTiang,
            'statusDistribution' => $statusDistribution,
            'mitraData' => $mitraData,
        ]);
    }
}