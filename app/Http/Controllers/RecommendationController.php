<?php

namespace App\Http\Controllers;

use App\Models\CompetitionModel;
use App\Models\CategoryModel;
use App\Models\SkillModel;
use App\Models\UserModel; // Add this import
use App\Services\FuzzyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecommendationController extends Controller
{
    protected $fuzzyService;

    public function __construct(FuzzyService $fuzzyService)
    {
        $this->fuzzyService = $fuzzyService;
    }

    public function index(Request $request)
    {
        $competitions = CompetitionModel::with(['category', 'skills'])
            ->where('status', 'ongoing')
            ->orderBy('created_at', 'desc')
            ->get();

        $categories = CategoryModel::all();
        $skills = SkillModel::all();

        $selectedCompetition = null;
        $recommendations = [];

        if ($request->has('competition_id') && $request->competition_id) {
            $selectedCompetition = CompetitionModel::with(['category', 'skills'])
                ->findOrFail($request->competition_id);

            $competitionSkills = $selectedCompetition->skills->pluck('id')->toArray();
            $competitionCategory = $selectedCompetition->category_id;

            $recommendations = $this->fuzzyService->calculateRecommendations(
                $selectedCompetition->id,
                $competitionSkills,
                $competitionCategory
            );
        }

        return Inertia::render('dashboard/admin/recommendations/index', [
            'competitions' => $competitions,
            'categories' => $categories,
            'skills' => $skills,
            'selectedCompetition' => $selectedCompetition,
            'recommendations' => $recommendations,
            'filters' => [
                'competition_id' => $request->competition_id
            ]
        ]);
    }

    public function getRecommendations(Request $request)
    {
        $request->validate([
            'competition_id' => 'required|exists:competitions,id'
        ]);

        $competition = CompetitionModel::with(['category', 'skills'])
            ->findOrFail($request->competition_id);

        $competitionSkills = $competition->skills->pluck('id')->toArray();
        $competitionCategory = $competition->category_id;

        $recommendations = $this->fuzzyService->calculateRecommendations(
            $competition->id,
            $competitionSkills,
            $competitionCategory
        );

        return response()->json([
            'recommendations' => $recommendations,
            'competition' => $competition
        ]);
    }

    public function getDetailedAnalysis(Request $request)
    {
        $request->validate([
            'mahasiswa_id' => 'required|exists:users,id',
            'competition_id' => 'required|exists:competitions,id'
        ]);

        $competition = CompetitionModel::with(['category', 'skills'])
            ->findOrFail($request->competition_id);

        $mahasiswa = UserModel::with(['skills'])
            ->where('role', 'mahasiswa')
            ->findOrFail($request->mahasiswa_id);

        $competitionSkills = $competition->skills->pluck('id')->toArray();
        $competitionCategory = $competition->category_id;

        $analysis = $this->fuzzyService->getDetailedAnalysis(
            $mahasiswa,
            $competitionSkills,
            $competitionCategory
        );

        return response()->json([
            'analysis' => $analysis,
            'mahasiswa' => $mahasiswa,
            'competition' => $competition
        ]);
    }

    public function showAnalysis(Request $request)
    {
        $mahasiswaId = $request->get('mahasiswa_id');
        $competitionId = $request->get('competition_id');

        if (!$mahasiswaId || !$competitionId) {
            return redirect()->back()->with('error', 'Parameter tidak lengkap');
        }

        // Ambil data mahasiswa
        $mahasiswa = UserModel::with(['skills', 'competitions'])->findOrFail($mahasiswaId);

        // Ambil data kompetisi
        $competition = CompetitionModel::with(['category', 'skills'])->findOrFail($competitionId);

        // Ambil skill IDs kompetisi
        $competitionSkills = $competition->skills->pluck('id')->toArray();

        // Gunakan FuzzyService untuk mendapatkan analisis detail
        $analysis = $this->fuzzyService->getDetailedAnalysis(
            $mahasiswa,
            $competitionSkills,
            $competition->category_id
        );

        return Inertia::render('dashboard/admin/recommendations/Analysis', [
            'mahasiswa' => $mahasiswa,
            'competition' => $competition,
            'analysis' => $analysis
        ]);
    }

    public function exportRecommendations(Request $request)
    {
        $request->validate([
            'competition_id' => 'required|exists:competitions,id'
        ]);

        $competition = CompetitionModel::with(['category', 'skills'])
            ->findOrFail($request->competition_id);

        $competitionSkills = $competition->skills->pluck('id')->toArray();
        $competitionCategory = $competition->category_id;

        $recommendations = $this->fuzzyService->calculateRecommendations(
            $competition->id,
            $competitionSkills,
            $competitionCategory
        );

        // Format data untuk export
        $exportData = collect($recommendations)->map(function ($rec) {
            return [
                'Nama' => $rec['name'],
                'Email' => $rec['email'],
                'Identifier' => $rec['identifier'],
                'Skill Level' => $rec['skill_level'],
                'Total Kompetisi' => $rec['total_competitions'],
                'Total Menang' => $rec['total_wins'],
                'Win Rate (%)' => number_format($rec['win_rate'], 2),
                'Skor Rekomendasi' => number_format($rec['recommendation_score'], 2),
                'Status Rekomendasi' => $rec['recommendation_label']
            ];
        });

        $filename = 'rekomendasi_' . str_replace(' ', '_', strtolower($competition->name)) . '_' . date('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($exportData) {
            $file = fopen('php://output', 'w');

            // Header CSV
            if ($exportData->isNotEmpty()) {
                fputcsv($file, array_keys($exportData->first()));

                // Data rows
                foreach ($exportData as $row) {
                    fputcsv($file, $row);
                }
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
