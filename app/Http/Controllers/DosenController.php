<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DosenController extends Controller
{

    public function index(Request $request)
    {
        return Inertia::render('dashboard/dosen/mahasiswaBimbingan', [
            'mahasiswa' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total_page' => 1,
                'total_data' => 0,
            ],
            'mahasiswaList' => [],
        ]);
    }

    public function create(Request $request)
    {
        return back();
    }

    public function show($id)
    {
        return back();
    }

    public function update(Request $request, $id)
    {
        return back();
    }

    public function destroy($id)
    {
        return back();
    }
}