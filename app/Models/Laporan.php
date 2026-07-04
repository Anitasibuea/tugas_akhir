<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Laporan extends Model
{
    use HasFactory;

    // Nama tabel
    protected $table = 'report';

    // Primary key
    protected $primaryKey = 'id';

    // Kolom yang boleh diisi
    protected $fillable = [
        'id',
        'tanggal',
        'deskripsi',
        'status_laporan',
        'tipe_tiang',
        'lokasi',
        'jenis_kabel',
        'panjang_tiang',
        'petugas_lapangan',
        'awal_kontrak',
        'akhir_kontrak',
        'jumlah_kabel',
        'latitude',
        'longitude',
        'nama_mitra',
        'foto',
        'signed_by_mitra',
        'signed_by_manajer',
        'signature_data',
        'signature_qr_mitra',
        'signature_qr_manajer',
        'signed_at_mitra',
        'signed_at_manajer '
    ];

    // Jika primary key auto increment
    public $incrementing = false;  // string IDs are not auto-increment

    // Tipe primary key
    protected $keyType = 'string';  // PLN-2025-001 is a string
    protected $casts = ['signed_at' => 'datetime'];

    public function isManajerSigned(): bool
    {
        return !is_null($this->signed_by_manajer);
    }
    public function isMitraSigned(): bool
    {
        return !is_null($this->signed_by_mitra);
    }
}
