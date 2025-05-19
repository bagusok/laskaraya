<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\ProgramStudiModel;

class ProgramStudiController extends Controller
{
    public function index(Request $request)
    {
        $prodiList = ProgramStudiModel::all(['id', 'nama']);
        return Inertia::render('dashboard/admin/prodi/programStudi', [
            'prodiList' => $prodiList,
        ]);
    }

    public function getAll()
    {
        $prodi = \App\Models\ProgramStudiModel::all(['id', 'nama']);
        return response()->json($prodi);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
        ]);
        $prodi = \App\Models\ProgramStudiModel::create($validated);
        return response()->json($prodi, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
        ]);
        $prodi = \App\Models\ProgramStudiModel::findOrFail($id);
        $prodi->update($validated);
        return response()->json($prodi);
    }

    public function destroy($id)
    {
        $prodi = \App\Models\ProgramStudiModel::findOrFail($id);
        $prodi->delete();
        return response()->json(['message' => 'Prodi berhasil dihapus']);
    }

    public function show($id)
    {
        $prodi = ProgramStudiModel::with(['mahasiswa.prodi'])->findOrFail($id);
        return Inertia::render('dashboard/admin/prodi/prodiDetail', [
            'prodi' => $prodi,
            'mahasiswaList' => $prodi->mahasiswa,
        ]);
    }
}