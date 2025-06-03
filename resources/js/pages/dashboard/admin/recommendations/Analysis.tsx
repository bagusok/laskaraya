import React from 'react';
import { usePage } from '@inertiajs/react';
import AdminLayout from "@/components/layouts/adminLayout";
import { ArrowLeft, User, Trophy, Target, TrendingUp, BarChart3, Activity, CheckCircle, XCircle, AlertTriangle, Weight, Calculator, Plus, Minus, Info } from 'lucide-react';

interface ScoringDetails {
    total_weighted_sum: number;
    total_weight: number;
    active_rules_count: number;
    base_score: number;
    experience_modifier: number;
    final_score: number;
    calculation_method: string;
    weighted_average: number;
    before_modifier: number;
}

interface AnalysisData {
    criteria: {
        skill_level: number;
        category_match: number;
        total_competitions: number;
        total_wins: number;
        win_rate: number;
    };
    fuzzy_values: Record<string, number>;
    rule_activations: Record<string, {
        activation: number;
        consequent: string;
        weight: number;
    }>;
    recommendation_score: number;
    recommendation_label: string;
    scoring_details?: ScoringDetails;
}

interface Mahasiswa {
    id: number;
    name: string;
    email: string;
    identifier: string;
    skills: Array<{ id: number; name: string; }>;
}

interface Competition {
    id: number;
    name: string;
    category: { id: number; name: string; };
    skills: Array<{ id: number; name: string; }>;
}

const CriteriaCard = ({ title, value, description, icon: Icon, color = "blue" }: {
    title: string;
    value: string | number;
    description: string;
    icon: any;
    color?: string;
}) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-200",
        green: "bg-green-50 text-green-600 border-green-200",
        purple: "bg-purple-50 text-purple-600 border-purple-200",
        orange: "bg-orange-50 text-orange-600 border-orange-200",
        red: "bg-red-50 text-red-600 border-red-200"
    };

    return (
        <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    );
};

const EnhancedWeightSummaryCard = ({ ruleActivations, analysis }: {
    ruleActivations: Record<string, { activation: number; consequent: string; weight: number; }>;
    analysis: AnalysisData;
}) => {
    const activeRules = Object.entries(ruleActivations).filter(([_, rule]) => rule.activation > 0);
    const scoringDetails = analysis.scoring_details;

    // Calculate weighted average
    const totalWeightedSum = activeRules.reduce((sum, [_, rule]) => sum + (rule.activation * rule.weight), 0);
    const totalWeight = activeRules.reduce((sum, [_, rule]) => sum + rule.activation, 0);
    const weightedAverage = totalWeight > 0 ? totalWeightedSum / totalWeight : 0;

    // Check for discrepancy
    const expectedScore = weightedAverage + (scoringDetails?.experience_modifier || 0);
    const actualScore = analysis.recommendation_score;
    const hasDiscrepancy = Math.abs(expectedScore - actualScore) > 0.1;

    const consequentGroups = activeRules.reduce((groups, [ruleId, rule]) => {
        if (!groups[rule.consequent]) {
            groups[rule.consequent] = [];
        }
        groups[rule.consequent].push({ ruleId, ...rule });
        return groups;
    }, {} as Record<string, any[]>);

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                    <Calculator className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Ringkasan Perhitungan Bobot</h3>
            </div>

            {/* Discrepancy Alert */}
            {hasDiscrepancy && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Perhatian: Ketidaksesuaian Perhitungan</span>
                    </div>
                    <div className="text-sm text-yellow-700 space-y-1">
                        <p>Skor yang dihitung: {expectedScore.toFixed(1)}</p>
                        <p>Skor aktual: {actualScore.toFixed(1)}</p>
                        <p className="font-medium text-red-600">Selisih: {(actualScore - expectedScore).toFixed(1)} poin</p>
                        <p className="text-xs mt-2">Kemungkinan ada faktor tambahan seperti skill bonus, category match bonus, atau baseline calculation.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border">
                    <p className="text-sm text-gray-600 mb-1">Total Aturan Aktif</p>
                    <p className="text-2xl font-bold text-gray-900">{activeRules.length}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <p className="text-sm text-gray-600 mb-1">Total Weighted Sum</p>
                    <p className="text-2xl font-bold text-gray-900">{totalWeightedSum.toFixed(1)}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border">
                    <p className="text-sm text-gray-600 mb-1">Total Weight</p>
                    <p className="text-2xl font-bold text-gray-900">{totalWeight.toFixed(2)}</p>
                </div>
            </div>

            {/* Show calculation method info */}
            <div className="bg-white rounded-lg p-4 border mb-4">
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Skor Weighted Average</p>
                    <div className="text-lg font-mono text-gray-700">
                        {totalWeightedSum.toFixed(1)} ÷ {totalWeight.toFixed(2)} = {weightedAverage.toFixed(1)}
                    </div>
                    {hasDiscrepancy && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                            <p className="text-sm text-yellow-700">
                                <strong>Skor Final Aktual: {actualScore.toFixed(1)}</strong>
                            </p>
                            <p className="text-xs text-red-600 mt-1">
                                Selisih {actualScore > weightedAverage ? '+' : ''}{(actualScore - weightedAverage).toFixed(1)} (kemungkinan ada bonus/modifier)
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {Object.keys(consequentGroups).length > 0 && (
                <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Distribusi per Kategori Rekomendasi</h4>
                    <div className="space-y-3">
                        {Object.entries(consequentGroups).map(([consequent, rules]) => {
                            const totalWeight = rules.reduce((sum, rule) => sum + (rule.activation * rule.weight), 0);
                            const getConsequentInfo = (consequent: string) => {
                                switch (consequent) {
                                    case 'DR': return { label: 'Direkomendasikan', color: 'green' };
                                    case 'DP': return { label: 'Dipertimbangkan', color: 'yellow' };
                                    case 'TD': return { label: 'Tidak Direkomendasikan', color: 'red' };
                                    default: return { label: consequent, color: 'gray' };
                                }
                            };

                            const info = getConsequentInfo(consequent);

                            return (
                                <div key={consequent} className="bg-white rounded-lg p-4 border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${info.color}-50 text-${info.color}-600`}>
                                                {info.label}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                                {rules.length} aturan
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                {totalWeight.toFixed(1)} poin
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {totalWeightedSum > 0 ? ((totalWeight / totalWeightedSum) * 100).toFixed(1) : '0'}% dari total
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailedCalculationCard = ({ analysis }: { analysis: AnalysisData }) => {
    const activeRules = Object.entries(analysis.rule_activations).filter(([_, rule]) => rule.activation > 0);
    const scoringDetails = analysis.scoring_details;

    if (!scoringDetails) {
        return null;
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Detail Perhitungan Skor Final</h3>
            </div>

            {scoringDetails.calculation_method === 'weighted_average' ? (
                <div className="space-y-4">
                    {/* Step 1: Weighted Sum */}
                    <div className="bg-white rounded-lg p-4 border">
                        <h4 className="font-semibold text-gray-900 mb-3">Langkah 1: Perhitungan Weighted Sum</h4>
                        <div className="space-y-2 text-sm">
                            {activeRules.map(([ruleId, rule]) => {
                                const contribution = rule.activation * rule.weight;
                                return (
                                    <div key={ruleId} className="flex justify-between items-center py-1">
                                        <span className="text-gray-600">
                                            {ruleId}: {(rule.activation * 100).toFixed(1)}% × {rule.weight}
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            = {contribution.toFixed(1)}
                                        </span>
                                    </div>
                                );
                            })}
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between items-center font-semibold text-gray-900">
                                    <span>Total Weighted Sum:</span>
                                    <span>{scoringDetails.total_weighted_sum}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Total Weight */}
                    <div className="bg-white rounded-lg p-4 border">
                        <h4 className="font-semibold text-gray-900 mb-3">Langkah 2: Total Weight (Aktivasi)</h4>
                        <div className="space-y-2 text-sm">
                            {activeRules.map(([ruleId, rule]) => (
                                <div key={ruleId} className="flex justify-between items-center py-1">
                                    <span className="text-gray-600">{ruleId}:</span>
                                    <span className="font-medium text-gray-900">
                                        {(rule.activation * 100).toFixed(1)}% = {rule.activation.toFixed(3)}
                                    </span>
                                </div>
                            ))}
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between items-center font-semibold text-gray-900">
                                    <span>Total Weight:</span>
                                    <span>{scoringDetails.total_weight}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Base Score */}
                    <div className="bg-white rounded-lg p-4 border">
                        <h4 className="font-semibold text-gray-900 mb-3">Langkah 3: Base Score (Weighted Average)</h4>
                        <div className="text-center py-4">
                            <div className="text-lg font-mono text-gray-700 mb-2">
                                {scoringDetails.total_weighted_sum} ÷ {scoringDetails.total_weight} = {scoringDetails.base_score}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total Weighted Sum ÷ Total Weight = Base Score
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Experience Modifier */}
                    {scoringDetails.experience_modifier !== 0 && (
                        <div className="bg-white rounded-lg p-4 border">
                            <h4 className="font-semibold text-gray-900 mb-3">Langkah 4: Experience Modifier</h4>
                            <div className="flex items-center justify-center gap-4 py-4">
                                <span className="text-lg font-semibold text-gray-900">
                                    {scoringDetails.base_score}
                                </span>
                                <div className="flex items-center gap-2">
                                    {scoringDetails.experience_modifier > 0 ? (
                                        <Plus className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Minus className="h-4 w-4 text-red-600" />
                                    )}
                                    <span className={`font-semibold ${
                                        scoringDetails.experience_modifier > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {Math.abs(scoringDetails.experience_modifier)}
                                    </span>
                                </div>
                                <span className="text-lg font-semibold text-gray-900">=</span>
                                <span className="text-xl font-bold text-blue-600">
                                    {scoringDetails.final_score}
                                </span>
                            </div>
                            <div className="text-center text-sm text-gray-600">
                                Base Score {scoringDetails.experience_modifier > 0 ? '+' : ''} Experience Modifier = Final Score
                            </div>
                        </div>
                    )}

                    {/* Final Result */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white">
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-2">{scoringDetails.final_score}</div>
                            <div className="text-blue-100">Skor Final (Range: 15-85)</div>
                        </div>
                    </div>
                </div>
            ) : (
                // Baseline calculation method
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Info className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800">
                                Metode Baseline Score
                            </span>
                        </div>
                        <p className="text-sm text-yellow-700">
                            Tidak ada aturan fuzzy yang aktif. Menggunakan perhitungan baseline berdasarkan kriteria dasar.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border">
                        <h4 className="font-semibold text-gray-900 mb-3">Baseline Score Calculation</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Skill Level:</p>
                                <p className="font-semibold text-gray-900">{analysis.criteria.skill_level}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Category Match:</p>
                                <p className="font-semibold text-gray-900">
                                    {analysis.criteria.category_match ? 'Ya' : 'Tidak'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Competitions:</p>
                                <p className="font-semibold text-gray-900">{analysis.criteria.total_competitions}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Wins:</p>
                                <p className="font-semibold text-gray-900">{analysis.criteria.total_wins}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-4 text-white">
                        <div className="text-center">
                            <div className="text-3xl font-bold mb-2">{scoringDetails.final_score}</div>
                            <div className="text-gray-100">Baseline Score</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const RuleActivationCard = ({ ruleId, rule }: {
    ruleId: string;
    rule: { activation: number; consequent: string; weight: number; };
}) => {
    if (rule.activation === 0) return null;

    const getConsequentColor = (consequent: string) => {
        switch (consequent) {
            case 'DR': return 'text-green-600 bg-green-50 border-green-200';
            case 'DP': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'TD': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getConsequentLabel = (consequent: string) => {
        switch (consequent) {
            case 'DR': return 'Direkomendasikan';
            case 'DP': return 'Dipertimbangkan';
            case 'TD': return 'Tidak Direkomendasikan';
            default: return consequent;
        }
    };

    const contributionScore = (rule.activation * rule.weight).toFixed(1);

    return (
        <div className="bg-white rounded-lg border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900 text-lg">{ruleId}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getConsequentColor(rule.consequent)}`}>
                    {getConsequentLabel(rule.consequent)}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <p className="text-sm font-medium text-gray-700">Aktivasi</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{(rule.activation * 100).toFixed(1)}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${rule.activation * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <Weight className="h-4 w-4 text-purple-600" />
                        <p className="text-sm font-medium text-gray-700">Bobot</p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{rule.weight}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(rule.weight / 85) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                <div className="flex items-center gap-2 mb-1">
                    <Calculator className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm font-medium text-indigo-700">Kontribusi Skor</p>
                </div>
                <p className="text-lg font-bold text-indigo-900">
                    {contributionScore} poin
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                    {(rule.activation * 100).toFixed(1)}% × {rule.weight} = {contributionScore}
                </p>
            </div>
        </div>
    );
};

export default function RecommendationAnalysis() {
    const { mahasiswa, competition, analysis } = usePage().props as {
        mahasiswa: Mahasiswa;
        competition: Competition;
        analysis: AnalysisData;
    };

    const goBack = () => {
        window.history.back();
    };

    const getRecommendationIcon = (label: string) => {
        switch (label) {
            case 'Sangat Direkomendasikan':
                return CheckCircle;
            case 'Dipertimbangkan':
                return AlertTriangle;
            case 'Tidak Direkomendasikan':
                return XCircle;
            default:
                return Target;
        }
    };

    const getRecommendationColor = (label: string) => {
        switch (label) {
            case 'Sangat Direkomendasikan':
                return 'green';
            case 'Dipertimbangkan':
                return 'orange';
            case 'Tidak Direkomendasikan':
                return 'red';
            default:
                return 'blue';
        }
    };

    const RecommendationIcon = getRecommendationIcon(analysis.recommendation_label);
    const recommendationColor = getRecommendationColor(analysis.recommendation_label);

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={goBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">Detail Analisis Rekomendasi</h1>
                        <p className="text-gray-600 mt-1">Analisis perhitungan fuzzy untuk rekomendasi mahasiswa</p>
                    </div>
                </div>

                {/* Mahasiswa Info */}
                <div className="bg-white rounded-xl border p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900">{mahasiswa.name}</h2>
                            <p className="text-gray-600">{mahasiswa.identifier}</p>
                            <p className="text-gray-500 text-sm">{mahasiswa.email}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {mahasiswa.skills.map(skill => (
                                    <span key={skill.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Competition Info */}
                <div className="bg-white rounded-xl border p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Kompetisi: {competition.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">Kategori: {competition.category.name}</p>
                    <div className="flex flex-wrap gap-2">
                        {competition.skills.map(skill => (
                            <span key={skill.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Final Result */}
                <div className="bg-white rounded-xl border p-6">
                    <div className="text-center">
                        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-lg bg-${recommendationColor}-50 text-${recommendationColor}-600 mb-4`}>
                            <RecommendationIcon className="h-8 w-8" />
                            <div>
                                <p className="text-2xl font-bold">{analysis.recommendation_score.toFixed(1)}</p>
                                <p className="text-sm font-medium">{analysis.recommendation_label}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Weight Summary with Discrepancy Detection */}
                <EnhancedWeightSummaryCard
                    ruleActivations={analysis.rule_activations}
                    analysis={analysis}
                />

                {/* Detailed Calculation Card */}
                <DetailedCalculationCard analysis={analysis} />

                {/* Active Rules */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Aturan yang Aktif</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(analysis.rule_activations)
                            .filter(([_, rule]) => rule.activation > 0)
                            .sort(([_, a], [__, b]) => (b.activation * b.weight) - (a.activation * a.weight))
                            .map(([ruleId, rule]) => (
                                <RuleActivationCard key={ruleId} ruleId={ruleId} rule={rule} />
                            ))}
                    </div>
                    {Object.values(analysis.rule_activations).every(rule => rule.activation === 0) && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Tidak ada aturan yang aktif</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
