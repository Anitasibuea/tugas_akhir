<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mitra extends Model
{
    use HasFactory;
    protected $table = 'mitra';

    protected $fillable = [
    'nama_perusahaan',
    'alamat',
    'telepon',
    'email',
    'petugas_mapping',
    'status',
];

    public function user()
    {
        return $this->belongsTo(Mitra::class);
    }

    public function laporans()
    {
        return $this->hasMany(Laporan::class);
    }
    public function petugas()
{
    return $this->belongsTo(User::class, 'petugas_mapping');
}
}
