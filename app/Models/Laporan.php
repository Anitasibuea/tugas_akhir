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
    protected $primaryKey = 'no_laporan';

    // Kolom yang boleh diisi
    protected $fillable = [
        'id',
        'tanggal',
        'deskripsi',
        'status_laporan',
        'tipe_tiang',
        'lokasi',
        'petugas_mitra',
        'latitude',
        'longitude',
        'nama_mitra'
    ];

    // Jika primary key auto increment
    public $incrementing = true;

    // Tipe primary key
    protected $keyType = 'int';
}

