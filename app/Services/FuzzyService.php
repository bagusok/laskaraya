<?php

namespace App\Services;

use App\Models\UserModel;
use App\Models\SkillModel;
use Illuminate\Support\Facades\DB;

class FuzzyService
{
    private $alternatives;
    private $criteria;
    private $fuzzyRules;
    private $membershipValues;
    private $ruleActivations;
    private $aggregatedOutputs;

    public function __construct()
    {
        $this->fuzzyRules = [
            // Rules prioritas TINGGI untuk DR - harus ada pengalaman
            'R1' => [
                'condition' => 'winrate_tinggi',
                'consequent' => 'DR',
                'weight' => 85
            ],
            'R2' => [
                'condition' => 'skill_tinggi AND kategori_sama AND lomba_diikuti_tinggi',
                'consequent' => 'DR',
                'weight' => 82
            ],
            'R3' => [
                'condition' => 'lomba_menang_tinggi',
                'consequent' => 'DR',
                'weight' => 80
            ],
            'R4' => [
                'condition' => 'skill_tinggi AND winrate_sedang AND lomba_diikuti_sedang',
                'consequent' => 'DR',
                'weight' => 75
            ],
            'R5' => [
                'condition' => 'lomba_diikuti_tinggi AND winrate_sedang',
                'consequent' => 'DR',
                'weight' => 70
            ],

            //skill tinggi dengan pengalaman terbatas
            'R6' => [
                'condition' => 'skill_sedang AND kategori_sama',
                'consequent' => 'DP',
                'weight' => 60
            ],
            'R7' => [
                'condition' => 'winrate_sedang AND kategori_sama',
                'consequent' => 'DP',
                'weight' => 58
            ],
            'R8' => [
                'condition' => 'skill_tinggi AND kategori_sama AND lomba_diikuti_rendah',
                'consequent' => 'DP',
                'weight' => 55  // Diturunkan dari 55
            ],
            'R9' => [
                'condition' => 'skill_tinggi AND kategori_beda',
                'consequent' => 'DP',
                'weight' => 50
            ],
            'R10' => [
                'condition' => 'lomba_diikuti_sedang AND lomba_menang_sedang',
                'consequent' => 'DP',
                'weight' => 48
            ],
            'R11' => [
                'condition' => 'skill_sedang AND winrate_sedang',
                'consequent' => 'DP',
                'weight' => 45
            ],

            //untuk skill tinggi tanpa pengalaman - skor lebih rendah
            'R12' => [
                'condition' => 'skill_tinggi AND lomba_diikuti_rendah AND kategori_beda',
                'consequent' => 'DP',
                'weight' => 40  // Lebih rendah
            ],

            //skill rendah atau tanpa pengalaman signifikan
            'R13' => [
                'condition' => 'skill_rendah AND lomba_diikuti_rendah',
                'consequent' => 'TD',
                'weight' => 25
            ],
            'R14' => [
                'condition' => 'winrate_rendah AND skill_rendah',
                'consequent' => 'TD',
                'weight' => 20
            ],
            'R15' => [
                'condition' => 'skill_rendah AND kategori_beda',
                'consequent' => 'TD',
                'weight' => 15
            ]
        ];
    }

    public function calculateRecommendations($competitionId, $competitionSkills, $competitionCategory)
    {
        $this->alternatives = UserModel::where('role', 'mahasiswa')
            ->with(['skills', 'competitions'])
            ->get()
            ->map(function ($mahasiswa) use ($competitionSkills, $competitionCategory) {
                $skillMatch = $this->calculateSkillMatch($mahasiswa, $competitionSkills);
                $actualSkillLevel = $this->getActualSkillLevel($mahasiswa);

                // Gunakan kombinasi atau pilih salah satu sesuai kebutuhan
                $finalSkillLevel = $this->calculateFinalSkillLevel($actualSkillLevel, $skillMatch);

                $categoryMatch = $this->calculateCategoryMatch($mahasiswa, $competitionCategory);
                $totalCompetitions = $this->getTotalCompetitions($mahasiswa);
                $totalWins = $this->getTotalWins($mahasiswa);
                $winRate = $totalCompetitions > 0 ? ($totalWins / $totalCompetitions) * 100 : 0;

                return [
                    'id' => $mahasiswa->id,
                    'name' => $mahasiswa->name,
                    'email' => $mahasiswa->email,
                    'identifier' => $mahasiswa->identifier,
                    'skill_level' => $finalSkillLevel, // Menggunakan skill level yang sudah diperbaiki
                    'actual_skill_level' => $actualSkillLevel, // Tambahan untuk debugging
                    'skill_match_ratio' => $skillMatch, // Tambahan untuk debugging
                    'category_match' => $categoryMatch,
                    'total_competitions' => $totalCompetitions,
                    'total_wins' => $totalWins,
                    'win_rate' => $winRate
                ];
            })
            ->toArray();

        foreach ($this->alternatives as &$alternative) {
            $alternative['fuzzy_values'] = $this->fuzzification($alternative);
        }

        foreach ($this->alternatives as &$alternative) {
            $alternative['rule_activations'] = $this->evaluateRules($alternative['fuzzy_values']);
            $alternative['recommendation_score'] = $this->defuzzification($alternative['rule_activations'], $alternative);
            $alternative['recommendation_label'] = $this->getRecommendationLabel($alternative['recommendation_score']);
        }

        $ranked = collect($this->alternatives)->sortByDesc('recommendation_score')->values()->all();

        return $ranked;
    }

    // Mengambil skill level sebenarnya dari database
    private function getActualSkillLevel($mahasiswa)
    {
        // Ambil skill level tertinggi mahasiswa dari tabel user_skills
        $maxSkillLevel = DB::table('user_to_skills')
            ->where('user_id', $mahasiswa->id)
            ->max('level');

        return $maxSkillLevel ?? 0; // Return 0 jika tidak ada skill
    }

    private function calculateFinalSkillLevel($actualSkillLevel, $skillMatchRatio)
    {
        if ($skillMatchRatio == 0) {
            return 0; // Jika tidak ada skill yang cocok, skill level harus 0
        }
        // Gabungkan actualSkillLevel dengan skillMatchRatio
        return min($actualSkillLevel, round($skillMatchRatio * 5, 2));
    }

    private function calculateSkillMatch($mahasiswa, $competitionSkills)
    {
        if (empty($competitionSkills)) {
            return 0;
        }

        $mahasiswaSkills = $mahasiswa->skills->pluck('id')->toArray();
        $matchingSkills = array_intersect($mahasiswaSkills, $competitionSkills);
        $matchRatio = count($matchingSkills) / count($competitionSkills);

        // Konversi ke skala 1-5 untuk skill match ratio
        return round($matchRatio * 5, 2);
    }

    private function calculateCategoryMatch($mahasiswa, $competitionCategory)
    {
        $mahasiswaCategory = $mahasiswa->prodi_id ?? 0;
        return $mahasiswaCategory == $competitionCategory ? 1 : 0;
    }

    private function getTotalCompetitions($mahasiswa)
    {
        // Ambil kompetisi di mana mahasiswa adalah registrant (ketua tim)
        $asRegistrant = DB::table('user_to_competitions')
            ->where('registrant_id', $mahasiswa->id)
            ->count();

        // Ambil kompetisi di mana mahasiswa adalah anggota tim
        $asMember = DB::table('competition_members')
            ->join('user_to_competitions', 'competition_members.user_to_competition_id', '=', 'user_to_competitions.id')
            ->where('competition_members.user_id', $mahasiswa->id)
            ->count();

        // return $asRegistrant + $asMember;
        $user = UserModel::with('mahasiswa', 'dosen')->find($mahasiswa->id);

        return $user->mahasiswa->total_competitions;
    }

    private function getTotalWins($mahasiswa)
    {
        // Ambil kemenangan di mana mahasiswa adalah registrant (ketua tim)
        $winsAsRegistrant = DB::table('user_to_competitions')
            ->where('registrant_id', $mahasiswa->id)
            ->where('status', 'accepted')
            ->count();

        // Ambil kemenangan di mana mahasiswa adalah anggota tim
        $winsAsMember = DB::table('competition_members')
            ->join('user_to_competitions', 'competition_members.user_to_competition_id', '=', 'user_to_competitions.id')
            ->where('competition_members.user_id', $mahasiswa->id)
            ->where('user_to_competitions.status', 'accepted')
            ->count();

        $user = UserModel::with('mahasiswa', 'dosen')->find($mahasiswa->id);

        return $user->mahasiswa->total_wins;

        // return $winsAsRegistrant + $winsAsMember;
    }

    private function fuzzification($alternative)
    {
        $fuzzy = [];

        // Skill Level (0-5)
        $skill = $alternative['skill_level'];

        if ($skill == 0) {
            $fuzzy['skill_rendah'] = 1.0;
            $fuzzy['skill_sedang'] = 0.0;
            $fuzzy['skill_tinggi'] = 0.0;
        } else {
            // Skill rendah: 1-2
            $fuzzy['skill_rendah'] = $this->trapezoidalMembership($skill, 0, 0, 1.5, 2.5);
            // Skill sedang: 2-4
            $fuzzy['skill_sedang'] = $this->triangularMembership($skill, 1.5, 3, 4.5);
            // Skill tinggi: 4-5
            $fuzzy['skill_tinggi'] = $this->trapezoidalMembership($skill, 3.5, 4, 5, 5);
        }

        // Category Match (0 atau 1)
        $category = $alternative['category_match'];
        $fuzzy['kategori_sama'] = $category;
        $fuzzy['kategori_beda'] = 1 - $category;

        // Total Competitions
        $competitions = $alternative['total_competitions'];
        $fuzzy['lomba_diikuti_rendah'] = $this->trapezoidalMembership($competitions, 0, 0, 0, 1);
        $fuzzy['lomba_diikuti_sedang'] = $this->triangularMembership($competitions, 0, 2, 4);
        $fuzzy['lomba_diikuti_tinggi'] = $this->trapezoidalMembership($competitions, 3, 5, 100, 100);

        // Total Wins
        $wins = $alternative['total_wins'];
        $fuzzy['lomba_menang_rendah'] = $this->trapezoidalMembership($wins, 0, 0, 0, 1);
        $fuzzy['lomba_menang_sedang'] = $this->triangularMembership($wins, 0, 1, 3);
        $fuzzy['lomba_menang_tinggi'] = $this->trapezoidalMembership($wins, 2, 3, 100, 100);

        // Win Rate (0-100%)
        $winRate = $alternative['win_rate'];
        if ($alternative['total_competitions'] == 0) {
            // Jika belum pernah lomba, set nilai yang mencerminkan kurangnya pengalaman
            $fuzzy['winrate_rendah'] = 0.8;
            $fuzzy['winrate_sedang'] = 0.2;
            $fuzzy['winrate_tinggi'] = 0;
        } else {
            $fuzzy['winrate_rendah'] = $this->trapezoidalMembership($winRate, 0, 0, 20, 40);
            $fuzzy['winrate_sedang'] = $this->triangularMembership($winRate, 25, 50, 75);
            $fuzzy['winrate_tinggi'] = $this->trapezoidalMembership($winRate, 65, 80, 100, 100);
        }

        return $fuzzy;
    }

    private function triangularMembership($x, $a, $b, $c)
    {
        if ($x <= $a || $x >= $c) {
            return 0;
        } elseif ($x > $a && $x <= $b) {
            return ($x - $a) / ($b - $a);
        } else {
            return ($c - $x) / ($c - $b);
        }
    }

    private function trapezoidalMembership($x, $a, $b, $c, $d)
    {
        if ($x <= $a || $x >= $d) {
            return 0;
        } elseif ($x > $a && $x <= $b) {
            return ($x - $a) / ($b - $a);
        } elseif ($x > $b && $x <= $c) {
            return 1;
        } else {
            return ($d - $x) / ($d - $c);
        }
    }

    private function evaluateRules($fuzzyValues)
    {
        $ruleActivations = [];

        foreach ($this->fuzzyRules as $ruleId => $rule) {
            $activation = $this->evaluateRuleCondition($rule['condition'], $fuzzyValues);
            $ruleActivations[$ruleId] = [
                'activation' => $activation,
                'consequent' => $rule['consequent'],
                'weight' => $rule['weight']
            ];
        }

        return $ruleActivations;
    }

    private function evaluateRuleCondition($condition, $fuzzyValues)
    {
        $condition = strtolower($condition);

        $replacements = [
            'skill_tinggi' => $fuzzyValues['skill_tinggi'],
            'skill_sedang' => $fuzzyValues['skill_sedang'],
            'skill_rendah' => $fuzzyValues['skill_rendah'],
            'kategori_sama' => $fuzzyValues['kategori_sama'],
            'kategori_beda' => $fuzzyValues['kategori_beda'],
            'lomba_diikuti_tinggi' => $fuzzyValues['lomba_diikuti_tinggi'],
            'lomba_diikuti_sedang' => $fuzzyValues['lomba_diikuti_sedang'],
            'lomba_diikuti_rendah' => $fuzzyValues['lomba_diikuti_rendah'],
            'lomba_menang_tinggi' => $fuzzyValues['lomba_menang_tinggi'],
            'lomba_menang_sedang' => $fuzzyValues['lomba_menang_sedang'],
            'lomba_menang_rendah' => $fuzzyValues['lomba_menang_rendah'],
            'winrate_tinggi' => $fuzzyValues['winrate_tinggi'],
            'winrate_sedang' => $fuzzyValues['winrate_sedang'],
            'winrate_rendah' => $fuzzyValues['winrate_rendah'],
        ];

        foreach ($replacements as $var => $value) {
            $condition = str_replace($var, $value, $condition);
        }

        return $this->evaluateFuzzyLogic($condition);
    }

    private function evaluateFuzzyLogic($expression)
    {
        // Split berdasarkan OR terlebih dahulu
        $orParts = explode(' or ', $expression);
        $orResults = [];

        foreach ($orParts as $orPart) {
            // Split berdasarkan AND
            $andParts = explode(' and ', trim($orPart));
            $andResults = [];

            foreach ($andParts as $andPart) {
                $value = floatval(trim($andPart));
                $andResults[] = $value;
            }

            // AND operation (minimum)
            $orResults[] = empty($andResults) ? 0 : min($andResults);
        }

        // OR operation (maximum)
        return empty($orResults) ? 0 : max($orResults);
    }

    private function defuzzification($ruleActivations, $alternative)
    {
        $totalWeightedSum = 0;
        $totalWeight = 0;

        foreach ($ruleActivations as $rule) {
            if ($rule['activation'] > 0) {
                $totalWeightedSum += $rule['activation'] * $rule['weight'];
                $totalWeight += $rule['activation'];
            }
        }

        if ($totalWeight == 0) {
            return $this->calculateImprovedBaselineScore($alternative);
        }

        $score = $totalWeightedSum / $totalWeight;

        //untuk membedakan pengalaman
        $experienceModifier = $this->calculateExperienceModifier($alternative);
        $finalScore = $score + $experienceModifier;

        return max(15, min(85, round($finalScore, 2)));
    }

    //untuk membedakan mahasiswa berpengalaman
    private function calculateExperienceModifier($alternative)
    {
        $totalCompetitions = $alternative['total_competitions'] ?? 0;
        $totalWins = $alternative['total_wins'] ?? 0;
        $skillLevel = $alternative['skill_level'] ?? 0;

        // Jika skill tinggi (>= 4) tetapi tidak ada pengalaman lomba
        if ($skillLevel >= 4 && $totalCompetitions == 0) {
            return -8; // Penalty untuk skill tinggi tanpa pengalaman
        }

        // Jika skill tinggi dan ada pengalaman menang
        if ($skillLevel >= 4 && $totalWins > 0) {
            return +5; // Bonus untuk skill tinggi dengan kemenangan
        }

        // Jika ada pengalaman lomba yang baik
        if ($totalCompetitions >= 2 && $totalWins > 0) {
            return +3; // Bonus untuk pengalaman positif
        }

        // Jika hanya ikut lomba tanpa menang
        if ($totalCompetitions > 0 && $totalWins == 0) {
            return -2; // Penalty kecil untuk pengalaman tanpa hasil
        }

        return 0;
    }

    private function calculateImprovedBaselineScore($alternative)
    {
        $skillLevel = $alternative['skill_level'] ?? 0;
        $categoryMatch = $alternative['category_match'] ?? 0;
        $totalCompetitions = $alternative['total_competitions'] ?? 0;
        $totalWins = $alternative['total_wins'] ?? 0;

        // Base score rendah
        $baseScore = 15;

        if ($skillLevel == 0) {
            // Skill 0 tetap mendapat skor rendah
            return $categoryMatch == 1 ? 20 : 15;
        }

        // Skill bonus (lebih konservatif)
        $skillBonus = ($skillLevel / 5) * 20; // Max 20 poin dari skill

        // Category bonus
        $categoryBonus = $categoryMatch * 8;

        $experienceBonus = 0;
        if ($totalWins > 0) {
            $experienceBonus = min($totalWins * 4, 12);
        } elseif ($totalCompetitions > 0) {
            $experienceBonus = min($totalCompetitions * 1, 4);
        }

        $finalScore = $baseScore + $skillBonus + $categoryBonus + $experienceBonus;

        // PERBAIKAN: Skill tinggi tanpa pengalaman dapat penalty
        if ($skillLevel >= 4 && $totalCompetitions == 0) {
            $finalScore -= 8; // Penalty untuk skill tinggi tanpa pengalaman
        }

        return max(15, min(85, round($finalScore, 2)));
    }

    public function debugScoring($alternative)
    {
        $fuzzyValues = $this->fuzzification($alternative);
        $ruleActivations = $this->evaluateRules($fuzzyValues);

        echo "=== DEBUG SCORING ===\n";
        echo "Name: " . $alternative['name'] . "\n";
        echo "Actual Skill Level: " . ($alternative['actual_skill_level'] ?? 'N/A') . "\n";
        echo "Final Skill Level: " . $alternative['skill_level'] . "\n";
        echo "Skill Match Ratio: " . ($alternative['skill_match_ratio'] ?? 'N/A') . "\n";
        echo "Total Competitions: " . $alternative['total_competitions'] . "\n";
        echo "Total Wins: " . $alternative['total_wins'] . "\n";
        echo "Category Match: " . $alternative['category_match'] . "\n";

        echo "\nFuzzy Values:\n";
        foreach ($fuzzyValues as $key => $value) {
            if ($value > 0) {
                echo "  $key: $value\n";
            }
        }

        echo "\nActive Rules:\n";
        foreach ($ruleActivations as $ruleId => $rule) {
            if ($rule['activation'] > 0) {
                echo "  $ruleId: activation={$rule['activation']}, consequent={$rule['consequent']}, weight={$rule['weight']}\n";
            }
        }

        $score = $this->defuzzification($ruleActivations, $alternative);
        echo "\nExperience Modifier: " . $this->calculateExperienceModifier($alternative) . "\n";
        echo "Final Score: $score\n";
        echo "Label: " . $this->getRecommendationLabel($score) . "\n";
        echo "=====================\n\n";

        return $score;
    }

    private function getRecommendationLabel($score)
    {
        if ($score >= 60) {
            return 'Sangat Direkomendasikan';
        } elseif ($score >= 35) {
            return 'Dipertimbangkan';
        } else {
            return 'Tidak Direkomendasikan';
        }
    }

    public function getDetailedAnalysis($mahasiswa, $competitionSkills, $competitionCategory)
    {
        $skillMatch = $this->calculateSkillMatch($mahasiswa, $competitionSkills);
        $actualSkillLevel = $this->getActualSkillLevel($mahasiswa);
        $finalSkillLevel = $this->calculateFinalSkillLevel($actualSkillLevel, $skillMatch);
        $categoryMatch = $this->calculateCategoryMatch($mahasiswa, $competitionCategory);
        $totalCompetitions = $this->getTotalCompetitions($mahasiswa);
        $totalWins = $this->getTotalWins($mahasiswa);
        $winRate = $totalCompetitions > 0 ? ($totalWins / $totalCompetitions) * 100 : 0;

        $criteria = [
            'skill_level' => $finalSkillLevel,
            'actual_skill_level' => $actualSkillLevel,
            'skill_match_ratio' => $skillMatch,
            'category_match' => $categoryMatch,
            'total_competitions' => $totalCompetitions,
            'total_wins' => $totalWins,
            'win_rate' => $winRate
        ];

        $fuzzyValues = $this->fuzzification($criteria);
        $ruleActivations = $this->evaluateRules($fuzzyValues);

        // Hitung detail perhitungan skor
        $scoringDetails = $this->calculateDetailedScoring($ruleActivations, $criteria);

        return [
            'criteria' => $criteria,
            'fuzzy_values' => $fuzzyValues,
            'rule_activations' => $ruleActivations,
            'recommendation_score' => $scoringDetails['final_score'],
            'recommendation_label' => $this->getRecommendationLabel($scoringDetails['final_score']),
            'scoring_details' => $scoringDetails
        ];
    }

    private function calculateDetailedScoring($ruleActivations, $alternative)
    {
        $totalWeightedSum = 0;
        $totalWeight = 0;
        $activeRulesCount = 0;

        // Hitung weighted sum dan total weight
        foreach ($ruleActivations as $rule) {
            if ($rule['activation'] > 0) {
                $totalWeightedSum += $rule['activation'] * $rule['weight'];
                $totalWeight += $rule['activation'];
                $activeRulesCount++;
            }
        }

        $baseScore = 0;
        $experienceModifier = 0;
        $finalScore = 0;
        $calculationMethod = '';

        if ($totalWeight == 0) {
            // Tidak ada rule aktif - gunakan baseline
            $baseScore = $this->calculateImprovedBaselineScore($alternative);
            $finalScore = $baseScore;
            $calculationMethod = 'baseline';
        } else {
            // Ada rule aktif - hitung weighted average
            $baseScore = $totalWeightedSum / $totalWeight;
            $experienceModifier = $this->calculateExperienceModifier($alternative);
            $finalScore = $baseScore + $experienceModifier;
            $calculationMethod = 'weighted_average';
        }

        // Pastikan skor dalam range 15-85
        $finalScore = max(15, min(85, round($finalScore, 2)));

        return [
            'total_weighted_sum' => round($totalWeightedSum, 2),
            'total_weight' => round($totalWeight, 2),
            'active_rules_count' => $activeRulesCount,
            'base_score' => round($baseScore, 2),
            'experience_modifier' => round($experienceModifier, 2),
            'final_score' => $finalScore,
            'calculation_method' => $calculationMethod,
            'weighted_average' => $totalWeight > 0 ? round($totalWeightedSum / $totalWeight, 2) : 0,
            'before_modifier' => $totalWeight > 0 ? round($baseScore, 2) : 0
        ];
    }
}
