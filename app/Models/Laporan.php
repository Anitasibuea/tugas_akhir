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
        'petugas_lapangan',
        'latitude',
        'longitude',
        'nama_mitra',
        'foto',
    ];

// Jika primary key auto increment
public $incrementing = false;  // string IDs are not auto-increment

// Tipe primary key
protected $keyType = 'string';  // PLN-2025-001 is a string
}

