<?php

namespace App\Jobs;

use App\Models\Laporan;
use App\Notifications\KontrakBerakhir;
use App\Notifications\KontrakAkanBerakhir;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendContractNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $laporan;
    protected $type;

    public function __construct(Laporan $laporan, $type)
    {
        $this->laporan = $laporan;
        $this->type = $type;
    }

    public function handle()
    {
        $user = $this->laporan->mitra?->petugas;

        if ($user) {
            if ($this->type === 'reminder') {
                $user->notify(new KontrakAkanBerakhir($this->laporan));
                $this->laporan->update(['reminder_sent_at' => now()]);
            } else {
                // $user->notify(new KontrakBerakhir($this->laporan));
                $this->laporan->update(['notified_at' => now()]);
            }
        }
    }
}