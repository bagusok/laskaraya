<?php
namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use App\Models\AchievementModel;

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
$data = \App\Models\AchievementModel::query()
->when($this->year, fn($q) => $q->whereYear('date', $this->year))
->when($this->category && $this->category !== 'all', fn($q) => $q->where('category_id', $this->category))
->when($this->level && $this->level !== 'all', fn($q) => $q->where('level', $this->level))
->get();

    return view('exports.reports', [
        'achievements' => $data
    ]);
}
}
