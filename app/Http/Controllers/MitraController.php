<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MitraController extends Controller
{
    public function index() 
    {
        return Inertia::render("Mitra/MitraPage");
    }

    public function store()
    {
        
    }
}
