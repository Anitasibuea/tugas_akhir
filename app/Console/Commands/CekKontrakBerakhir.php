<?php

namespace App\Console\Commands;

use App\Notifications\KontrakBerakhir;
use Illuminate\Console\Command;
use App\Models\Laporan;
use App\Jobs\SendContractNotification;


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
        $reminders = Laporan::with(['mitra.petugas'])
            ->whereDate('akhir_kontrak', $sevenDays)
            ->whereNotNull('nama_mitra')
            ->whereNull('reminder_sent_at')
            ->get();

        foreach ($reminders as $laporan) {
            SendContractNotification::dispatch($laporan, 'reminder');
            $this->info("⚠️  Reminder queued for laporan {$laporan->id}");
        }

        // ── 2. Final notice: on expiry date ─────────────────────
        $expired = Laporan::with(['mitra.petugas'])
            ->whereDate('akhir_kontrak', '<=', $today)
            ->whereNotNull('nama_mitra')
            ->whereNull('notified_at')
            ->get();

        foreach ($expired as $laporan) {
            SendContractNotification::dispatch($laporan, 'expiry');
            $this->info("✓ Email berakhir queued for laporan {$laporan->id}");
        }

        $this->info('Selesai. Reminder: ' . $reminders->count() . ' | Berakhir: ' . $expired->count());
    }
}