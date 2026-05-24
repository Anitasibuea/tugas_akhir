<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Mitra;

class MitraController extends Controller
{
    public function index() 
    {
        return Inertia::render("Mitra/MitraPage");
    }

    public function index2() 
    {

        return Inertia::render("Mitra/AddMitra");
    }

  public function store(Request $request)
{
    $validated = $request->validate([
        'nama_perusahaan' => 'required',
        'alamat' => 'required',
        'telepon' => 'required',
        'email' => 'required|email',
        'petugas_mapping' => 'required',
        'status' => 'required',
    ]);

    Mitra::create($validated);

    return redirect()->back()->with(
        'success',
        'Data mitra berhasil ditambahkan'
    );

    }
}
