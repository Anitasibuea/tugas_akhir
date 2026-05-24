<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Mitra;
use App\Models\User;

class MitraController extends Controller
{
    public function index() 
    {
        return Inertia::render("Mitra/MitraPage", [
            "mitras"=> Mitra::latest()->get(),
        ]);
    }

    public function index2() 
    {

        return Inertia::render("Mitra/AddMitra",[
            'petugasUsers' => User::role('mitra')
                    ->select('id', 'name')
                    ->get(),
        ]

        );
    }

  public function store(Request $request)
{
    $validated = $request->validate([
        'nama_perusahaan' => 'required',
        'alamat' => 'required',
        'telepon' => 'required',
        'email' => 'required|email',
        'petugas_mapping' => 'required|exists:users,id',
        'status' => 'required',
    ]);

    Mitra::create($validated);

    return redirect()->back()->with(
        'success',
        'Data mitra berhasil ditambahkan'
    );

    }
}
