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
            "mitras" => Mitra::with('petugas:id,name')->latest()->get(),
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
    
    public function update(Request $request,$id)
    {
       $validated = $request->validate([
        'nama_perusahaan' => 'required',
        'alamat' => 'required',
        'telepon' => 'required',
        'email' => 'required|email',
        'petugas_mapping' => 'required|exists:users,id',
        'status' => 'required',
    ]);

    $mitra = Mitra::findOrFail($id);
    $mitra->update($validated);
    return redirect()->route('mitra.index')->with('success', 'Mitra berhasil diupdate');
    
    }

    public function destroy($id)
{
    $mitra = Mitra::findOrFail($id);
    $mitra->delete();

    return redirect()->route('mitra.index')->with('success', 'Mitra berhasil dihapus');
}
}
