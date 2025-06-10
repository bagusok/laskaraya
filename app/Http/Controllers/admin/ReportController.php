<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\AchievementModel;
use App\Models\CategoryModel;
use App\Models\CompetitionModel;
use App\Models\UserModel;
use App\Models\UserToCompetition;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Exports\ReportExport;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    // Main page - render the React component
    public function index(Request $request)
    {
        return Inertia::render('dashboard/admin/reports/index');
    }

    // API endpoint to get report data
    public function getData(Request $request)
    {
        try {
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
        } catch (\Exception $e) {
            \Log::error('Report getData error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => $this->getEmptyData()
            ]);
        }
    }

    // API endpoint to get filter options
    public function getFilters()
    {
        try {
            // Get available years from competitions
            $years = CompetitionModel::selectRaw('YEAR(start_date) as year')
                ->distinct()
                ->whereNotNull('start_date')
                ->orderBy('year', 'desc')
                ->pluck('year')
                ->filter() // Remove null values
                ->values(); // Re-index array

            // If no years found, add current year as default
            if ($years->isEmpty()) {
                $years = collect([date('Y')]);
            }

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
                    'years' => $years->toArray(),
                    'categories' => $categories->toArray(),
                    'levels' => $levels
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Report getFilters error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'data' => [
                    'years' => [date('Y')],
                    'categories' => [],
                    'levels' => [
                        ['value' => '5', 'label' => 'Internasional'],
                        ['value' => '4', 'label' => 'Nasional'],
                        ['value' => '3', 'label' => 'Regional'],
                        ['value' => '2', 'label' => 'Provinsi'],
                        ['value' => '1', 'label' => 'Lokal']
                    ]
                ]
            ]);
        }
    }

    private function getEmptyData()
    {
        return [
            'summary' => [
                'totalStudents' => 0,
                'totalCompetitions' => 0,
                'totalAchievements' => 0,
                'winRate' => 0
            ],
            'categoryStats' => [],
            'levelDistribution' => [],
            'monthlyTrend' => [],
            'topPerformers' => [],
            'recommendationStats' => [
                'totalRecommendations' => 0,
                'acceptedRecommendations' => 0,
                'successRate' => 0,
                'averageMatchScore' => 0
            ]
        ];
    }

    private function getSummaryStats($year, $category, $level)
    {
        try {
            // Base query untuk kompetisi berdasarkan filter
            $competitionQuery = CompetitionModel::query();

            // Add year filter if start_date exists
            if ($year && $year !== 'all') {
                $competitionQuery->whereNotNull('start_date')->whereYear('start_date', $year);
            }

            if ($category !== 'all') {
                $competitionQuery->where('category_id', $category);
            }
            if ($level !== 'all') {
                $competitionQuery->where('level', $level);
            }

            $competitionIds = $competitionQuery->pluck('id');

            // Check if we have any competitions
            if ($competitionIds->isEmpty()) {
                return [
                    'totalStudents' => 0,
                    'totalCompetitions' => 0,
                    'totalAchievements' => 0,
                    'winRate' => 0
                ];
            }

            // Total active students (yang berpartisipasi di kompetisi dengan filter)
            $totalStudents = UserToCompetition::whereIn('competition_id', $competitionIds)
                ->distinct('registrant_id')
                ->count();

            // Total competitions
            $totalCompetitions = $competitionIds->count();

            // Total achievements
            $totalAchievements = AchievementModel::whereHas('userToCompetition', function ($q) use ($competitionIds) {
                $q->whereIn('competition_id', $competitionIds);
            })->count();

            // Total participations untuk win rate
            $totalParticipations = UserToCompetition::whereIn('competition_id', $competitionIds)->count();

            // Calculate win rate
            $winRate = $totalParticipations > 0 ? round(($totalAchievements / $totalParticipations) * 100, 1) : 0;

            return [
                'totalStudents' => $totalStudents,
                'totalCompetitions' => $totalCompetitions,
                'totalAchievements' => $totalAchievements,
                'winRate' => (float) $winRate
            ];
        } catch (\Exception $e) {
            \Log::error('getSummaryStats error: ' . $e->getMessage());
            return [
                'totalStudents' => 0,
                'totalCompetitions' => 0,
                'totalAchievements' => 0,
                'winRate' => 0
            ];
        }
    }

    private function getCategoryStats($year, $level)
    {
        try {
            $categories = CategoryModel::all();
            $categoryStats = [];

            foreach ($categories as $category) {
                // Query kompetisi untuk kategori ini
                $competitionQuery = CompetitionModel::where('category_id', $category->id);

                if ($year && $year !== 'all') {
                    $competitionQuery->whereNotNull('start_date')->whereYear('start_date', $year);
                }

                if ($level !== 'all') {
                    $competitionQuery->where('level', $level);
                }

                $competitionIds = $competitionQuery->pluck('id');
                $totalCompetitions = $competitionIds->count();

                if ($totalCompetitions > 0) {
                    // Hitung prestasi untuk kategori ini
                    $wins = AchievementModel::whereHas('userToCompetition', function ($q) use ($competitionIds) {
                        $q->whereIn('competition_id', $competitionIds);
                    })->count();

                    // Hitung mahasiswa yang terlibat
                    $students = UserToCompetition::whereIn('competition_id', $competitionIds)
                        ->distinct('registrant_id')
                        ->count();

                    $categoryStats[] = [
                        'name' => $category->name,
                        'competitions' => $totalCompetitions,
                        'wins' => $wins,
                        'students' => $students
                    ];
                }
            }

            return $categoryStats;
        } catch (\Exception $e) {
            \Log::error('getCategoryStats error: ' . $e->getMessage());
            return [];
        }
    }

    private function getLevelDistribution($year, $category)
    {
        try {
            $levels = [
                5 => 'Internasional',
                4 => 'Nasional',
                3 => 'Regional',
                2 => 'Provinsi',
                1 => 'Lokal'
            ];

            $query = CompetitionModel::query();

            if ($year && $year !== 'all') {
                $query->whereNotNull('start_date')->whereYear('start_date', $year);
            }
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

                if ($count > 0) { // Hanya tampilkan yang ada datanya
                    $distribution[] = [
                        'level' => $levelName,
                        'count' => $count,
                        'percentage' => $percentage
                    ];
                }
            }

            return $distribution;
        } catch (\Exception $e) {
            \Log::error('getLevelDistribution error: ' . $e->getMessage());
            return [];
        }
    }

    private function getMonthlyTrend($year, $category, $level)
    {
        try {
            $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            $monthlyData = [];

            for ($month = 1; $month <= 12; $month++) {
                $competitionsQuery = CompetitionModel::query();

                if ($year && $year !== 'all') {
                    $competitionsQuery->whereNotNull('start_date')
                        ->whereYear('start_date', $year)
                        ->whereMonth('start_date', $month);
                }

                if ($category !== 'all') {
                    $competitionsQuery->where('category_id', $category);
                }
                if ($level !== 'all') {
                    $competitionsQuery->where('level', $level);
                }

                $competitionIds = $competitionsQuery->pluck('id');
                $competitions = $competitionIds->count();

                $achievements = AchievementModel::whereHas('userToCompetition', function ($q) use ($competitionIds) {
                    $q->whereIn('competition_id', $competitionIds);
                })->count();

                $monthlyData[] = [
                    'month' => $months[$month - 1],
                    'competitions' => $competitions,
                    'achievements' => $achievements
                ];
            }

            return $monthlyData;
        } catch (\Exception $e) {
            \Log::error('getMonthlyTrend error: ' . $e->getMessage());
            return [];
        }
    }

    private function getTopPerformers($year, $category, $level, $limit = 5)
    {
        try {
            // Base query untuk kompetisi berdasarkan filter
            $competitionQuery = CompetitionModel::query();

            if ($year && $year !== 'all') {
                $competitionQuery->whereNotNull('start_date')->whereYear('start_date', $year);
            }
            if ($category !== 'all') {
                $competitionQuery->where('category_id', $category);
            }
            if ($level !== 'all') {
                $competitionQuery->where('level', $level);
            }

            $competitionIds = $competitionQuery->pluck('id');

            if ($competitionIds->isEmpty()) {
                return [];
            }

            // Query untuk mendapatkan top performers
            $topPerformers = UserModel::where('role', 'mahasiswa')
                ->join('user_to_competitions', 'users.id', '=', 'user_to_competitions.registrant_id')
                ->join('achievements', 'user_to_competitions.id', '=', 'achievements.user_to_competition_id')
                ->whereIn('user_to_competitions.competition_id', $competitionIds)
                ->groupBy('users.id', 'users.name', 'users.identifier')
                ->selectRaw('users.*, COUNT(achievements.id) as total_achievements')
                ->orderBy('total_achievements', 'desc')
                ->limit($limit)
                ->get();

            $result = [];
            foreach ($topPerformers as $user) {
                // Dapatkan kategori kompetisi yang diikuti user
                $userCategories = CategoryModel::whereHas('competitions', function ($q) use ($user, $competitionIds) {
                    $q->whereIn('competitions.id', $competitionIds)
                        ->whereHas('userToCompetition', function ($subQ) use ($user) {
                            $subQ->where('registrant_id', $user->id);
                        });
                })->pluck('name')->toArray();

                $result[] = [
                    'name' => $user->name,
                    'nim' => $user->identifier,
                    'achievements' => (int) $user->total_achievements,
                    'categories' => $userCategories,
                    'prodi' => null // You can add prodi relation if available
                ];
            }

            return $result;
        } catch (\Exception $e) {
            \Log::error('getTopPerformers error: ' . $e->getMessage());
            return [];
        }
    }

    private function getRecommendationStats($year)
    {
        try {
            // Total recommendations (all participations)
            $totalRecommendations = UserToCompetition::when($year && $year !== 'all', function ($q) use ($year) {
                $q->whereHas('competition', function ($subQ) use ($year) {
                    $subQ->whereNotNull('start_date')->whereYear('start_date', $year);
                });
            })->count();

            // Accepted recommendations (participations with accepted status)
            $acceptedRecommendations = UserToCompetition::where('status', 'accepted')
                ->when($year && $year !== 'all', function ($q) use ($year) {
                    $q->whereHas('competition', function ($subQ) use ($year) {
                        $subQ->whereNotNull('start_date')->whereYear('start_date', $year);
                    });
                })->count();

            // Success rate based on accepted recommendations
            $successRate = $totalRecommendations > 0 ?
                round(($acceptedRecommendations / $totalRecommendations) * 100, 1) : 0;

            // Calculate average match score based on achievements vs accepted participations
            $totalAchievements = AchievementModel::whereHas('userToCompetition', function ($q) use ($year) {
                $q->where('status', 'accepted');
                if ($year && $year !== 'all') {
                    $q->whereHas('competition', function ($subQ) use ($year) {
                        $subQ->whereNotNull('start_date')->whereYear('start_date', $year);
                    });
                }
            })->count();

            $averageMatchScore = $acceptedRecommendations > 0 ?
                min(round(($totalAchievements / $acceptedRecommendations) * 10, 1), 10) : 0;

            return [
                'totalRecommendations' => $totalRecommendations,
                'acceptedRecommendations' => $acceptedRecommendations,
                'successRate' => (float) $successRate,
                'averageMatchScore' => (float) $averageMatchScore
            ];
        } catch (\Exception $e) {
            \Log::error('getRecommendationStats error: ' . $e->getMessage());
            return [
                'totalRecommendations' => 0,
                'acceptedRecommendations' => 0,
                'successRate' => 0,
                'averageMatchScore' => 0
            ];
        }
    }

    public function export(Request $request)
    {
        $year = $request->input('year');
        $category = $request->input('category');
        $level = $request->input('level');

        return Excel::download(new ReportExport($year, $category, $level), 'report.xlsx');
    }

    private function exportToExcel($data, $year, $category, $level)
    {
        $filename = "laporan_prestasi_{$year}.xlsx";

        return response()->json([
            'success' => true,
            'message' => 'Excel report generated successfully',
            'filename' => $filename,
            'download_url' => url("/admin/reports/download/{$filename}")
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
            fputcsv($file, ['Nama', 'NIM', 'Jumlah Prestasi', 'Kategori']);
            foreach ($data['topPerformers'] as $performer) {
                fputcsv($file, [
                    $performer['name'],
                    $performer['nim'],
                    $performer['achievements'],
                    implode(', ', $performer['categories'])
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
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
