<?php

namespace App\Http\Controllers;

use App\Models\PeriodModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PeriodController extends Controller
{
    public function index()
    {
        $periodList = PeriodModel::orderBy('year', 'desc')->orderBy('name')->get();
        return Inertia::render('dashboard/admin/period/period', [
            'periodList' => $periodList,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => ['required', 'regex:/^\\d{4}$/'],
        ]);
        PeriodModel::create($validated);
        return redirect()->back()->with('success', 'Berhasil menambah periode');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'year' => ['required', 'regex:/^\\d{4}$/'],
        ]);
        $period = PeriodModel::findOrFail($id);
        $period->update($validated);
        return redirect()->back()->with('success', 'Berhasil mengubah periode');
    }

    public function destroy($id)
    {
        $period = PeriodModel::findOrFail($id);
        $period->delete();
        return redirect()->back()->with('success', 'Berhasil menghapus periode');
    }

    public function show($id)
    {
        $period = \App\Models\PeriodModel::findOrFail($id);

        // Dummy data lomba (competition)
        $competitionList = [
            [
                'id' => 1,
                'name' => 'Olimpiade Matematika',
                'description' => 'Kompetisi matematika tingkat nasional.'
            ],
            [
                'id' => 2,
                'name' => 'Lomba Debat Bahasa Inggris',
                'description' => 'Debat bahasa Inggris antar universitas.'
            ]
        ];

        return Inertia::render('dashboard/admin/period/periodDetail', [
            'period' => $period,
            'competitionList' => $competitionList
        ]);
    }
}
