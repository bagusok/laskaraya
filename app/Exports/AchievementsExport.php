<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class ReportExport implements FromView
{
    protected $year;
    protected $category;
    protected $level;

    public function __construct($year, $category, $level)
    {
        $this->year = $year;
        $this->category = $category;
        $this->level = $level;
    }

    public function view(): View
    {
        $query = \App\Models\AchievementModel::query();

        if ($this->year) {
            $query->whereYear('date', $this->year);
        }

        if ($this->category && $this->category !== 'all') {
            $query->where('category_id', $this->category);
        }

        if ($this->level && $this->level !== 'all') {
            $query->where('level', $this->level);
        }

        $data = $query->with(['student', 'category'])->get();

        return view('exports.reports', [
            'achievements' => $data
        ]);
    }
}
