<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\UserModel;
use App\Models\CompetitionModel;
use App\Models\UserToCompetition;
use App\Models\AchievementModel;
use App\Models\CategoryModel;
use App\Models\PeriodModel;
use App\Models\SkillModel;
use Carbon\Carbon;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Get filter parameters with defaults
        $year = $request->get('year', date('Y'));
        $category = $request->get('category', 'all');
        $level = $request->get('level', 'all');

        // Get data for filters
        $periods = PeriodModel::selectRaw('YEAR(created_at) as year, name')
            ->distinct()
            ->orderBy('year', 'desc')
            ->get();

        $categories = CategoryModel::select('id', 'name')->get();

        $levels = [
            ['value' => '5', 'label' => 'Internasional'],
            ['value' => '4', 'label' => 'Nasional'],
            ['value' => '3', 'label' => 'Regional'],
            ['value' => '2', 'label' => 'Provinsi'],
            ['value' => '1', 'label' => 'Lokal']
        ];

        // Get report data
        $reportData = [
            'summary' => $this->getSummaryStats($year, $category, $level),
            'categoryStats' => $this->getCategoryStats($year, $level),
            'levelDistribution' => $this->getLevelDistribution($year, $category),
            'monthlyTrend' => $this->getMonthlyTrend($year, $category, $level),
            'topPerformers' => $this->getTopPerformers($year, $category, $level),
            'recommendationStats' => $this->getRecommendationStats($year)
        ];

        return Inertia::render('dashboard/admin/reports/index', [
            'filters' => [
                'year' => $year,
                'category' => $category,
                'level' => $level,
            ],
            'periods' => $periods,
            'categories' => $categories,
            'levels' => $levels,
            'reportData' => $reportData
        ]);
    }

    public function getData(Request $request)
    {
        $year = $request->get('year', date('Y'));
        $category = $request->get('category', 'all');
        $level = $request->get('level', 'all');

        $data = [
            'summary' => $this->getSummaryStats($year, $category, $level),
            'categoryStats' => $this->getCategoryStats($year, $level),
            'levelDistribution' => $this->getLevelDistribution($year, $category),
            'monthlyTrend' => $this->getMonthlyTrend($year, $category, $level),
            'topPerformers' => $this->getTopPerformers($year, $category, $level),
            'recommendationStats' => $this->getRecommendationStats($year)
        ];

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }

    private function getSummaryStats($year, $category, $level)
    {
        // Total active students (students who participated in competitions this year)
        $totalStudentsQuery = UserModel::where('role', 'mahasiswa')
            ->whereHas('competitions', function ($q) use ($year, $category, $level) {
                $q->whereYear('start_date', $year);
                if ($category !== 'all') {
                    $q->where('category_id', $category);
                }
                if ($level !== 'all') {
                    $q->where('level', $level);
                }
            });

        $totalStudents = $totalStudentsQuery->distinct()->count();

        // Total competitions
        $competitionsQuery = CompetitionModel::whereYear('start_date', $year);
        if ($category !== 'all') {
            $competitionsQuery->where('category_id', $category);
        }
        if ($level !== 'all') {
            $competitionsQuery->where('level', $level);
        }
        $totalCompetitions = $competitionsQuery->count();

        // Total achievements - perbaikan query
        $achievementsQuery = AchievementModel::whereHas('userToCompetition', function ($q) use ($year, $category, $level) {
            $q->whereHas('competition', function ($subQ) use ($year, $category, $level) {
                $subQ->whereYear('start_date', $year);
                if ($category !== 'all') {
                    $subQ->where('category_id', $category);
                }
                if ($level !== 'all') {
                    $subQ->where('level', $level);
                }
            });
        });
        $totalAchievements = $achievementsQuery->count();

        // Calculate win rate
        $totalParticipations = UserToCompetition::whereHas('competition', function ($q) use ($year, $category, $level) {
            $q->whereYear('start_date', $year);
            if ($category !== 'all') {
                $q->where('category_id', $category);
            }
            if ($level !== 'all') {
                $q->where('level', $level);
            }
        })->count();

        $winRate = $totalParticipations > 0 ? round(($totalAchievements / $totalParticipations) * 100, 1) : 0;

        return [
            'totalStudents' => $totalStudents,
            'totalCompetitions' => $totalCompetitions,
            'totalAchievements' => $totalAchievements,
            'winRate' => $winRate
        ];
    }

    private function getCategoryStats($year, $level)
    {
        $categories = CategoryModel::withCount([
            'competitions as total_competitions' => function ($query) use ($year, $level) {
                $query->whereYear('start_date', $year);
                if ($level !== 'all') {
                    $query->where('level', $level);
                }
            }
        ])->get();

        $categoryStats = [];
        foreach ($categories as $category) {
            $wins = AchievementModel::whereHas('userToCompetition', function ($q) use ($year, $level, $category) {
                $q->whereHas('competition', function ($subQ) use ($year, $level, $category) {
                    $subQ->whereYear('start_date', $year)
                        ->where('category_id', $category->id);
                    if ($level !== 'all') {
                        $subQ->where('level', $level);
                    }
                });
            })->count();

            $students = UserToCompetition::whereHas('competition', function ($q) use ($year, $level, $category) {
                $q->whereYear('start_date', $year)
                    ->where('category_id', $category->id);
                if ($level !== 'all') {
                    $q->where('level', $level);
                }
            })->distinct('registrant_id')->count();

            $categoryStats[] = [
                'name' => $category->name,
                'competitions' => (int) $category->total_competitions,
                'wins' => $wins,
                'students' => $students
            ];
        }

        return $categoryStats;
    }

    private function getLevelDistribution($year, $category)
    {
        $levels = [
            5 => 'Internasional',
            4 => 'Nasional',
            3 => 'Regional',
            2 => 'Provinsi',
            1 => 'Lokal'
        ];

        $query = CompetitionModel::whereYear('start_date', $year);
        if ($category !== 'all') {
            $query->where('category_id', $category);
        }

        $levelCounts = $query->groupBy('level')
            ->selectRaw('level, count(*) as count')
            ->pluck('count', 'level')
            ->toArray();

        $totalCompetitions = array_sum($levelCounts);
        $distribution = [];

        foreach ($levels as $levelNum => $levelName) {
            $count = $levelCounts[$levelNum] ?? 0;
            $percentage = $totalCompetitions > 0 ? round(($count / $totalCompetitions) * 100) : 0;

            $distribution[] = [
                'level' => $levelName,
                'count' => $count,
                'percentage' => $percentage
            ];
        }

        return $distribution;
    }

    private function getMonthlyTrend($year, $category, $level)
    {
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $monthlyData = [];

        for ($month = 1; $month <= 12; $month++) {
            $competitionsQuery = CompetitionModel::whereYear('start_date', $year)
                ->whereMonth('start_date', $month);

            if ($category !== 'all') {
                $competitionsQuery->where('category_id', $category);
            }
            if ($level !== 'all') {
                $competitionsQuery->where('level', $level);
            }

            $competitions = $competitionsQuery->count();

            $achievementsQuery = AchievementModel::whereHas('userToCompetition', function ($q) use ($year, $month, $category, $level) {
                $q->whereHas('competition', function ($subQ) use ($year, $month, $category, $level) {
                    $subQ->whereYear('start_date', $year)
                        ->whereMonth('start_date', $month);
                    if ($category !== 'all') {
                        $subQ->where('category_id', $category);
                    }
                    if ($level !== 'all') {
                        $subQ->where('level', $level);
                    }
                });
            });

            $achievements = $achievementsQuery->count();

            $monthlyData[] = [
                'month' => $months[$month - 1],
                'competitions' => $competitions,
                'achievements' => $achievements
            ];
        }

        return $monthlyData;
    }

    private function getTopPerformers($year, $category, $level, $limit = 5)
    {
        $topPerformers = UserModel::where('role', 'mahasiswa')
            ->select('users.*')
            ->join('user_to_competitions', 'users.id', '=', 'user_to_competitions.registrant_id')
            ->join('competitions', 'user_to_competitions.competition_id', '=', 'competitions.id')
            ->join('achievements', 'user_to_competitions.id', '=', 'achievements.user_to_competition_id')
            ->whereYear('competitions.start_date', $year);

        if ($category !== 'all') {
            $topPerformers->where('competitions.category_id', $category);
        }
        if ($level !== 'all') {
            $topPerformers->where('competitions.level', $level);
        }

        $topPerformers = $topPerformers
            ->groupBy('users.id', 'users.name', 'users.identifier')
            ->selectRaw('users.*, COUNT(achievements.id) as total_achievements')
            ->orderBy('total_achievements', 'desc')
            ->limit($limit)
            ->with('prodi')
            ->get();

        $result = [];
        foreach ($topPerformers as $user) {
            $userCategories = CategoryModel::whereHas('competitions.userToCompetition', function ($q) use ($user, $year) {
                $q->where('registrant_id', $user->id)
                    ->whereHas('competition', function ($subQ) use ($year) {
                        $subQ->whereYear('start_date', $year);
                    });
            })->pluck('name')->toArray();

            $result[] = [
                'name' => $user->name,
                'nim' => $user->identifier,
                'achievements' => (int) $user->total_achievements,
                'categories' => $userCategories,
                'prodi' => $user->prodi ? $user->prodi->nama : 'N/A'
            ];
        }

        return $result;
    }

    private function getRecommendationStats($year)
    {
        // Total recommendations (all participations)
        $totalRecommendations = UserToCompetition::whereHas('competition', function ($q) use ($year) {
            $q->whereYear('start_date', $year);
        })->count();

        // Accepted recommendations (participations with accepted status)
        $acceptedRecommendations = UserToCompetition::where('status', 'accepted')
            ->whereHas('competition', function ($q) use ($year) {
                $q->whereYear('start_date', $year);
            })->count();

        // Success rate based on accepted recommendations
        $successRate = $totalRecommendations > 0 ?
            round(($acceptedRecommendations / $totalRecommendations) * 100, 1) : 0;

        // Calculate average match score based on achievements vs accepted participations
        $totalAchievements = AchievementModel::whereHas('userToCompetition', function ($q) use ($year) {
            $q->whereHas('competition', function ($subQ) use ($year) {
                $subQ->whereYear('start_date', $year);
            });
        })->count();

        $averageMatchScore = $acceptedRecommendations > 0 ?
            round(($totalAchievements / $acceptedRecommendations) * 10, 1) : 0;

        return [
            'totalRecommendations' => $totalRecommendations,
            'acceptedRecommendations' => $acceptedRecommendations,
            'successRate' => $successRate,
            'averageMatchScore' => min($averageMatchScore, 10) // Max 10
        ];
    }

    public function export(Request $request)
    {
        $format = $request->get('format', 'pdf');
        $year = $request->get('year', date('Y'));
        $category = $request->get('category', 'all');
        $level = $request->get('level', 'all');

        // Get all report data
        $reportData = [
            'summary' => $this->getSummaryStats($year, $category, $level),
            'categoryStats' => $this->getCategoryStats($year, $level),
            'levelDistribution' => $this->getLevelDistribution($year, $category),
            'monthlyTrend' => $this->getMonthlyTrend($year, $category, $level),
            'topPerformers' => $this->getTopPerformers($year, $category, $level, 10),
            'recommendationStats' => $this->getRecommendationStats($year)
        ];

        switch ($format) {
            case 'pdf':
                return $this->exportToPdf($reportData, $year, $category, $level);
            case 'excel':
                return $this->exportToExcel($reportData, $year, $category, $level);
            case 'csv':
                return $this->exportToCsv($reportData, $year, $category, $level);
            default:
                return response()->json(['error' => 'Invalid format'], 400);
        }
    }

    private function exportToPdf($data, $year, $category, $level)
    {
        $filename = "laporan_prestasi_{$year}.pdf";

        return response()->json([
            'success' => true,
            'message' => 'PDF report generated successfully',
            'filename' => $filename,
            'download_url' => route('admin.reports.download', $filename)
        ]);
    }

    private function exportToExcel($data, $year, $category, $level)
    {
        $filename = "laporan_prestasi_{$year}.xlsx";

        return response()->json([
            'success' => true,
            'message' => 'Excel report generated successfully',
            'filename' => $filename,
            'download_url' => route('admin.reports.download', $filename)
        ]);
    }

    private function exportToCsv($data, $year, $category, $level)
    {
        $filename = "laporan_prestasi_{$year}.csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($data) {
            $file = fopen('php://output', 'w');

            // Write headers
            fputcsv($file, ['Laporan Prestasi Mahasiswa']);
            fputcsv($file, []);

            // Summary data
            fputcsv($file, ['RINGKASAN']);
            fputcsv($file, ['Total Mahasiswa', $data['summary']['totalStudents']]);
            fputcsv($file, ['Total Kompetisi', $data['summary']['totalCompetitions']]);
            fputcsv($file, ['Total Prestasi', $data['summary']['totalAchievements']]);
            fputcsv($file, ['Tingkat Keberhasilan (%)', $data['summary']['winRate']]);
            fputcsv($file, []);

            // Category stats
            fputcsv($file, ['STATISTIK KATEGORI']);
            fputcsv($file, ['Kategori', 'Kompetisi', 'Prestasi', 'Mahasiswa']);
            foreach ($data['categoryStats'] as $stat) {
                fputcsv($file, [
                    $stat['name'],
                    $stat['competitions'],
                    $stat['wins'],
                    $stat['students']
                ]);
            }
            fputcsv($file, []);

            // Top performers
            fputcsv($file, ['TOP PERFORMERS']);
            fputcsv($file, ['Nama', 'NIM', 'Jumlah Prestasi', 'Kategori', 'Program Studi']);
            foreach ($data['topPerformers'] as $performer) {
                fputcsv($file, [
                    $performer['name'],
                    $performer['nim'],
                    $performer['achievements'],
                    implode(', ', $performer['categories']),
                    $performer['prodi'] ?? 'N/A'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function showReportsPage()
    {
        return Inertia::render('dashboard/admin/reports/index');
    }

    public function getFilters()
    {
        $years = CompetitionModel::selectRaw('YEAR(start_date) as year')
            ->distinct()
            ->whereNotNull('start_date')
            ->orderBy('year', 'desc')
            ->pluck('year');

        $categories = CategoryModel::select('id', 'name')->get();

        $levels = [
            ['value' => '5', 'label' => 'Internasional'],
            ['value' => '4', 'label' => 'Nasional'],
            ['value' => '3', 'label' => 'Regional'],
            ['value' => '2', 'label' => 'Provinsi'],
            ['value' => '1', 'label' => 'Lokal']
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'years' => $years,
                'categories' => $categories,
                'levels' => $levels
            ]
        ]);
    }

    public function downloadReport($filename)
    {
        $filePath = storage_path('app/reports/' . $filename);

        if (!file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->download($filePath);
    }
}
