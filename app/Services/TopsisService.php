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
    private $decisionMatrix;
    private $normalizedMatrix;
    private $weightedMatrix;
    private $idealSolution;
    private $negativeIdealSolution;
    private $distances;
    private $preferences;

    public function __construct()
    {
        $this->weights = [
            'skill_match' => 0.25,    // Bobot untuk kecocokan skill (jumlah skill yang cocok)
            'skill_level' => 0.25,    // Bobot untuk level skill (rata-rata level skill)
            'wins' => 0.20,           // Bobot untuk jumlah kemenangan
            'competitions' => 0.15,    // Bobot untuk jumlah kompetisi yang diikuti
            'experience' => 0.15       // Bobot untuk pengalaman (jumlah total kompetisi)
        ];
    }

    public function calculateRecommendations($competitionSkills)
    {
        // Ambil semua dosen dengan relasi yang diperlukan
        $this->alternatives = DosenModel::with(['user', 'user.skills'])
            ->get()
            ->map(function ($dosen) use ($competitionSkills) {
                // Hitung skill match dan level
                $skillDetails = $this->calculateSkillDetails($dosen, $competitionSkills);

                // Hitung total pengalaman (jumlah kompetisi yang pernah diikuti)
                $totalExperience = $dosen->total_competitions;

                return [
                    'id' => $dosen->user_id,
                    'name' => $dosen->user->name,
                    'skill_match' => $skillDetails['match_score'],
                    'skill_level' => $skillDetails['level_score'],
                    'wins' => $dosen->total_wins,
                    'competitions' => $dosen->total_competitions,
                    'experience' => $totalExperience,
                    'skill_details' => [
                        'total_skills' => count($dosen->user->skills),
                        'matching_skills' => $skillDetails['matching_count'],
                        'required_skills' => count($competitionSkills),
                        'skill_levels' => $skillDetails['skill_levels'],
                        'level_distribution' => $skillDetails['level_distribution']
                    ]
                ];
            });

        // Buat matriks keputusan
        $this->decisionMatrix = $this->createDecisionMatrix();

        // Normalisasi matriks
        $this->normalizedMatrix = $this->normalizeMatrix($this->decisionMatrix);

        // Hitung matriks terbobot
        $this->weightedMatrix = $this->calculateWeightedMatrix();

        // Tentukan solusi ideal positif dan negatif
        $this->findIdealSolutions();

        // Hitung jarak ke solusi ideal
        $this->calculateDistances();

        // Hitung nilai preferensi
        $this->calculatePreferences();

        // Ubah preferensi ke skala 1-100
        $scaledPreferences = array_map(function ($p) {
            return round($p * 100, 2);
        }, $this->preferences);

        // Urutkan berdasarkan nilai preferensi
        $rankedRecommendations = $this->getRankedRecommendations($scaledPreferences);

        // Kembalikan detail perhitungan untuk tampilan
        return [
            'alternatives' => $this->alternatives,
            'weights' => $this->weights,
            'decisionMatrix' => $this->decisionMatrix,
            'normalizedMatrix' => $this->normalizedMatrix,
            'weightedMatrix' => $this->weightedMatrix,
            'idealSolution' => $this->idealSolution,
            'negativeIdealSolution' => $this->negativeIdealSolution,
            'distances' => $this->distances,
            'preferences' => $scaledPreferences,
            'rankedRecommendations' => $rankedRecommendations,
            'criteria' => [
                'skill_match' => [
                    'name' => 'Kecocokan Skill',
                    'description' => 'Persentase jumlah skill yang cocok dengan kebutuhan kompetisi',
                    'weight' => $this->weights['skill_match']
                ],
                'skill_level' => [
                    'name' => 'Level Skill',
                    'description' => 'Rata-rata level skill yang dimiliki dosen (1-5) ikut mempengaruhi hasil rekomendasi',
                    'weight' => $this->weights['skill_level']
                ],
                'wins' => [
                    'name' => 'Jumlah Kemenangan',
                    'description' => 'Total kemenangan yang pernah diraih dosen',
                    'weight' => $this->weights['wins']
                ],
                'competitions' => [
                    'name' => 'Jumlah Kompetisi',
                    'description' => 'Jumlah kompetisi yang sedang diikuti dosen',
                    'weight' => $this->weights['competitions']
                ],
                'experience' => [
                    'name' => 'Pengalaman',
                    'description' => 'Total pengalaman dosen dalam mengikuti kompetisi',
                    'weight' => $this->weights['experience']
                ]
            ]
        ];
    }

    private function calculateSkillDetails($dosen, $competitionSkills)
    {
        $dosenSkills = $dosen->user->skills->pluck('pivot.level', 'id')->toArray();
        $matchingSkills = array_intersect_key($dosenSkills, array_flip($competitionSkills));

        // Hitung score kecocokan skill (jumlah skill yang cocok)
        $matchScore = count($matchingSkills) / count($competitionSkills);

        // Hitung score level skill
        $totalLevelScore = 0;
        $skillLevels = [];
        $levelDistribution = [
            'beginner' => 0,
            'intermediate' => 0,
            'advanced' => 0,
            'expert' => 0,
            'master' => 0
        ];

        foreach ($matchingSkills as $skillId => $level) {
            // Konversi angka ke string jika perlu
            $levelStr = $this->normalizeLevel($level);
            $levelScore = $this->convertLevelToScore($levelStr);
            $totalLevelScore += $levelScore;

            // Hitung distribusi level
            if (isset($levelDistribution[$levelStr])) {
                $levelDistribution[$levelStr]++;
            }

            $skillLevels[] = [
                'skill_id' => $skillId,
                'level' => $levelStr,
                'score' => $levelScore
            ];
        }

        // Hitung weighted average level score
        $weightedLevelScore = 0;
        $totalWeight = 0;

        foreach ($levelDistribution as $level => $count) {
            if ($count > 0) {
                $levelWeight = $this->getLevelWeight($level);
                $weightedLevelScore += ($levelWeight * $count);
                $totalWeight += $count;
            }
        }

        $averageLevelScore = $totalWeight > 0 ? $weightedLevelScore / $totalWeight : 0;

        return [
            'match_score' => $matchScore,
            'level_score' => $averageLevelScore,
            'matching_count' => count($matchingSkills),
            'skill_levels' => $skillLevels,
            'level_distribution' => $levelDistribution
        ];
    }

    private function normalizeLevel($level)
    {
        // Jika sudah string, kembalikan lowercase
        if (is_string($level)) {
            $level = strtolower($level);
            if (in_array($level, ['beginner', 'intermediate', 'advanced', 'expert', 'master'])) {
                return $level;
            }
        }
        // Jika angka, konversi ke string level
        switch ((int)$level) {
            case 1:
                return 'beginner';
            case 2:
                return 'intermediate';
            case 3:
                return 'advanced';
            case 4:
                return 'expert';
            case 5:
                return 'master';
            default:
                return 'beginner';
        }
    }

    private function convertLevelToScore($level)
    {
        // Konversi level ke nilai 1-5
        switch (strtolower($level)) {
            case 'beginner':
                return 1;
            case 'intermediate':
                return 2;
            case 'advanced':
                return 3;
            case 'expert':
                return 4;
            case 'master':
                return 5;
            default:
                return 1;
        }
    }

    private function getLevelWeight($level)
    {
        // Bobot untuk setiap level
        switch (strtolower($level)) {
            case 'beginner':
                return 1.0;
            case 'intermediate':
                return 2.0;
            case 'advanced':
                return 3.0;
            case 'expert':
                return 4.0;
            case 'master':
                return 5.0;
            default:
                return 1.0;
        }
    }

    private function createDecisionMatrix()
    {
        $matrix = [];
        foreach ($this->alternatives as $alternative) {
            $matrix[] = [
                $alternative['skill_match'],
                $alternative['skill_level'],
                $alternative['wins'],
                $alternative['competitions'],
                $alternative['experience']
            ];
        }
        return $matrix;
    }

    private function normalizeMatrix($matrix)
    {
        $normalized = [];
        $sumSquares = array_fill(0, count($matrix[0]), 0);

        // Hitung jumlah pembagi untuk setiap kriteria
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

    private function getRankedRecommendations($scaledPreferences = null)
    {
        $ranked = [];
        $prefs = $scaledPreferences ?: $this->preferences;
        foreach ($this->alternatives as $i => $alternative) {
            $ranked[] = [
                'id' => $alternative['id'],
                'name' => $alternative['name'],
                'score' => $prefs[$i],
                'skill_match' => $alternative['skill_match'],
                'skill_level' => $alternative['skill_level'],
                'wins' => $alternative['wins'],
                'competitions' => $alternative['competitions'],
                'experience' => $alternative['experience'],
                'skill_details' => $alternative['skill_details']
            ];
        }
        // Urutkan berdasarkan score
        usort($ranked, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });
        return $ranked;
    }
}