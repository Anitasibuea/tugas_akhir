<?php

namespace App\Console\Commands;

use App\Notifications\KontrakBerakhir;
use Illuminate\Console\Command;
use App\Models\Laporan;
use App\Models\User;

class CekKontrakBerakhir extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'kontrak:cek-berakhir';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cek laporan yang kontraknya berakhir hari ini dan kirim email ke petugas';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today       = now()->toDateString();
        $sevenDays   = now()->addDays(7)->toDateString();

        // ── 1. Reminder: 7 days before ──────────────────────────
        $reminders = Laporan::whereDate('akhir_kontrak', $sevenDays)
            ->whereNotNull('petugas_lapangan')
            ->whereNull('reminder_sent_at') // only if not already sent
            ->get();

        foreach ($reminders as $laporan) {
            $user = User::where('name', $laporan->petugas_lapangan)->first();

            if ($user) {
                $user->notify(new \App\Notifications\KontrakAkanBerakhir($laporan));
                $laporan->update(['reminder_sent_at' => now()]);
                $this->info("⚠️  Reminder terkirim ke {$user->email} untuk laporan {$laporan->id}");
            } else {
                $this->warn("✗ User tidak ditemukan untuk laporan {$laporan->id}");
            }
        }

        // ── 2. Final notice: on expiry date ─────────────────────
        $expired = Laporan::whereDate('akhir_kontrak', '<=', $today)
            ->whereNotNull('petugas_lapangan')
            ->whereNull('notified_at') // only if not already sent
            ->get();

        foreach ($expired as $laporan) {
            $user = User::where('name', $laporan->petugas_lapangan)->first();

            if ($user) {
                $user->notify(new \App\Notifications\KontrakBerakhir($laporan));
                $laporan->update(['notified_at' => now()]);
                $this->info("✓ Email berakhir terkirim ke {$user->email} untuk laporan {$laporan->id}");
            } else {
                $this->warn("✗ User tidak ditemukan untuk laporan {$laporan->id}");
            }
        }

        $this->info('Selesai. Reminder: ' . $reminders->count() . ' | Berakhir: ' . $expired->count());
    }
}
