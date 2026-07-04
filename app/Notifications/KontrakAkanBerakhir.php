<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Laporan;

class KontrakAkanBerakhir extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Laporan $laporan) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Pengingat: Kontrak Laporan ' . $this->laporan->id . ' Akan Berakhir dalam 7 Hari')
            ->view('emails.kontrak-akan-berakhir', [
                'userName'     => $notifiable->name,
                'laporanId'    => $this->laporan->id,
                'namaMitra'    => $this->laporan->nama_mitra,
                'lokasi'       => $this->laporan->lokasi,
                'akhirKontrak' => \Carbon\Carbon::parse($this->laporan->akhir_kontrak)->format('d-m-Y'),
                'url'          => url('/report/' . $this->laporan->id),
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
