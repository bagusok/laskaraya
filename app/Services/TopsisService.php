<?php

namespace App\Services;

use App\Models\DosenModel;
use App\Models\SkillModel;
use Illuminate\Support\Facades\DB;

class TopsisService
{
    private $alternatives;
    private $criteria;
    private $weights;
    private $normalizedMatrix;
    private $weightedMatrix;
    private $idealSolution;
    private $negativeIdealSolution;
    private $distances;
    private $preferences;

    public function __construct()
    {
        $this->weights = [
            'skills' => 0.4,
            'wins' => 0.3,
            'competitions' => 0.3
        ];
    }

    public function calculateRecommendations($competitionSkills)
    {
        // Ambil semua dosen dengan relasi yang diperlukan
        $this->alternatives = DosenModel::with(['user', 'user.skills'])
            ->get()
            ->map(function ($dosen) use ($competitionSkills) {
                // Hitung skill match
                $skillMatch = $this->calculateSkillMatch($dosen, $competitionSkills);

                return [
                    'id' => $dosen->user_id,
                    'name' => $dosen->user->name,
                    'skills' => $skillMatch,
                    'wins' => $dosen->total_wins,
                    'competitions' => $dosen->total_competitions
                ];
            });

        // Buat matriks keputusan
        $decisionMatrix = $this->createDecisionMatrix();

        // Normalisasi matriks
        $this->normalizedMatrix = $this->normalizeMatrix($decisionMatrix);

        // Hitung matriks terbobot
        $this->weightedMatrix = $this->calculateWeightedMatrix();

        // Tentukan solusi ideal positif dan negatif
        $this->findIdealSolutions();

        // Hitung jarak ke solusi ideal
        $this->calculateDistances();

        // Hitung nilai preferensi
        $this->calculatePreferences();

        // Urutkan berdasarkan nilai preferensi
        return $this->getRankedRecommendations();
    }

    private function calculateSkillMatch($dosen, $competitionSkills)
    {
        $dosenSkills = $dosen->user->skills->pluck('id')->toArray();
        $matchingSkills = array_intersect($dosenSkills, $competitionSkills);
        return count($matchingSkills) / count($competitionSkills);
    }

    private function createDecisionMatrix()
    {
        $matrix = [];
        foreach ($this->alternatives as $alternative) {
            $matrix[] = [
                $alternative['skills'],
                $alternative['wins'],
                $alternative['competitions']
            ];
        }
        return $matrix;
    }

    private function normalizeMatrix($matrix)
    {
        $normalized = [];
        $sumSquares = array_fill(0, count($matrix[0]), 0);

        // Hitung jumlah kuadrat untuk setiap kriteria
        foreach ($matrix as $row) {
            foreach ($row as $i => $value) {
                $sumSquares[$i] += pow($value, 2);
            }
        }

        // Normalisasi
        foreach ($matrix as $row) {
            $normalizedRow = [];
            foreach ($row as $i => $value) {
                $denominator = sqrt($sumSquares[$i]);
                $normalizedRow[] = $denominator == 0 ? 0 : $value / $denominator;
            }
            $normalized[] = $normalizedRow;
        }

        return $normalized;
    }

    private function calculateWeightedMatrix()
    {
        $weighted = [];
        $weights = array_values($this->weights);

        foreach ($this->normalizedMatrix as $row) {
            $weightedRow = [];
            foreach ($row as $i => $value) {
                $weightedRow[] = $value * $weights[$i];
            }
            $weighted[] = $weightedRow;
        }

        return $weighted;
    }

    private function findIdealSolutions()
    {
        $this->idealSolution = [];
        $this->negativeIdealSolution = [];

        for ($i = 0; $i < count($this->weightedMatrix[0]); $i++) {
            $column = array_column($this->weightedMatrix, $i);
            $this->idealSolution[] = max($column);
            $this->negativeIdealSolution[] = min($column);
        }
    }

    private function calculateDistances()
    {
        $this->distances = [];

        foreach ($this->weightedMatrix as $row) {
            $positiveDistance = 0;
            $negativeDistance = 0;

            for ($i = 0; $i < count($row); $i++) {
                $positiveDistance += pow($row[$i] - $this->idealSolution[$i], 2);
                $negativeDistance += pow($row[$i] - $this->negativeIdealSolution[$i], 2);
            }

            $this->distances[] = [
                'positive' => sqrt($positiveDistance),
                'negative' => sqrt($negativeDistance)
            ];
        }
    }

    private function calculatePreferences()
    {
        $this->preferences = [];

        foreach ($this->distances as $distance) {
            $this->preferences[] = $distance['negative'] / ($distance['positive'] + $distance['negative']);
        }
    }

    private function getRankedRecommendations()
    {
        $ranked = [];

        foreach ($this->alternatives as $i => $alternative) {
            $ranked[] = [
                'id' => $alternative['id'],
                'name' => $alternative['name'],
                'score' => $this->preferences[$i],
                'skills' => $alternative['skills'],
                'wins' => $alternative['wins'],
                'competitions' => $alternative['competitions']
            ];
        }

        // Urutkan berdasarkan score
        usort($ranked, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        return $ranked;
    }
}