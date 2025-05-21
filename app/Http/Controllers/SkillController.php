<?php

namespace App\Http\Controllers;

use App\Models\SkillModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    public function index()
    {
        $skills = SkillModel::orderBy('created_at', 'desc')->get();
        return Inertia::render('dashboard/admin/skills/index', [
            'skills' => $skills
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        SkillModel::create($request->only('name'));
        return redirect()->back()->with('success', 'Skill berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $skill = SkillModel::findOrFail($id);
        $skill->update($request->only('name'));
        return redirect()->back()->with('success', 'Skill berhasil diperbarui');
    }

    public function destroy($id)
    {
        $skill = SkillModel::findOrFail($id);
        $skill->delete();
        return redirect()->back()->with('success', 'Skill berhasil dihapus');
    }

    // CRUD untuk dosen
    public function indexDosen()
    {
        $skills = SkillModel::orderBy('created_at', 'desc')->get();
        return Inertia::render('dashboard/dosen/skills/index', [
            'skills' => $skills
        ]);
    }

    public function storeDosen(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        SkillModel::create($request->only('name'));
        return redirect()->back()->with('success', 'Skill berhasil ditambahkan');
    }

    public function updateDosen(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $skill = SkillModel::findOrFail($id);
        $skill->update($request->only('name'));
        return redirect()->back()->with('success', 'Skill berhasil diperbarui');
    }

    public function destroyDosen($id)
    {
        $skill = SkillModel::findOrFail($id);
        $skill->delete();
        return redirect()->back()->with('success', 'Skill berhasil dihapus');
    }
}
