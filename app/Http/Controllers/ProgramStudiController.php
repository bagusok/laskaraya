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
        return redirect()->back()->with('success', 'Berhasil menambah program studi');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
        ]);
        $prodi = \App\Models\ProgramStudiModel::findOrFail($id);
        $prodi->update($validated);
        return redirect()->back()->with('success', 'Berhasil mengubah program studi');
    }

    public function destroy($id)
    {
        $prodi = \App\Models\ProgramStudiModel::findOrFail($id);
        $prodi->delete();
        return redirect()->back()->with('success', 'Berhasil menghapus program studi');
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
