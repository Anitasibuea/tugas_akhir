<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Laporan;

class PetaLokasiController extends Controller
{
    public function index()
    {
        return Inertia::render('PetaLokasi/Peta', [
            'report' => Laporan::latest()->get()
        ]);
    }
}
