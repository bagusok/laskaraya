import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/components/layouts/adminLayout";
import {
    Search,
    Eye,
    Filter,
    Users,
    Trophy,
    Target,
    TrendingUp
} from "lucide-react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
interface Competition {
    id: number;
    name: string;
    status: string;
    category: {
        id: number;
        name: string;
    };
    skills: Array<{
        id: number;
        name: string;
    }>;
}

interface Recommendation {
    id: number;
    name: string;
    email: string;
    identifier: string;
    skill_level: number;
    category_match: number;
    total_competitions: number;
    total_wins: number;
    win_rate: number;
    recommendation_score: number;
    recommendation_label: string;
}

interface Category {
    id: number;
    name: string;
}

interface Skill {
    id: number;
    name: string;
}

const StatCard = ({
    label,
    value,
    icon: Icon,
    className = "",
    color = "blue"
}: {
    label: string;
    value: string | number;
    icon: any;
    className?: string;
    color?: string;
}) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 border-blue-200",
        green: "bg-green-50 text-green-600 border-green-200",
        purple: "bg-purple-50 text-purple-600 border-purple-200",
        orange: "bg-orange-50 text-orange-600 border-orange-200"
    };

    return (
        <div className={`bg-white rounded-xl border p-6 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {value}
                    </p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
};

const RecommendationCard = ({
    recommendation,
    onViewDetail,
    teamMembers,
    setTeamMembers
}: {
    recommendation: Recommendation;
    onViewDetail: (recommendation: Recommendation) => void;
    teamMembers: number[];
    setTeamMembers: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
    const getStatusColor = (label: string) => {
        switch (label) {
            case "Sangat Direkomendasikan":
                return "bg-green-100 text-green-800";
            case "Dipertimbangkan":
                return "bg-yellow-100 text-yellow-800";
            case "Tidak Direkomendasikan":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-white rounded-xl border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 pb-4">
                <Checkbox
                    id="add-member"
                    checked={teamMembers.includes(recommendation.id)}
                    onCheckedChange={(v) => {
                        setTeamMembers((prev) => {
                            const newMembers = v
                                ? [...prev, recommendation.id]
                                : prev.filter((id) => id !== recommendation.id);
                            return newMembers;
                        });
                    }}
                />
                <Label htmlFor="add-member">Tambah Ke Tim</Label>
            </div>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                        {recommendation.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {recommendation.identifier}
                    </p>
                    <p className="text-sm text-gray-500">
                        {recommendation.email}
                    </p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(recommendation.recommendation_label)}`}
                >
                    {recommendation.recommendation_label}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                        {recommendation.recommendation_score.toFixed(1)}
                    </p>
                    <p className="text-xs text-blue-600">Skor Rekomendasi</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                        {recommendation.win_rate.toFixed(1)}%
                    </p>
                    <p className="text-xs text-green-600">Win Rate</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                <div className="text-center">
                    <p className="font-semibold text-gray-900">
                        {recommendation.skill_level.toFixed(1)}
                    </p>
                    <p className="text-gray-600">Skill Level</p>
                </div>
                <div className="text-center">
                    <p className="font-semibold text-gray-900">
                        {recommendation.total_competitions}
                    </p>
                    <p className="text-gray-600">Total Lomba</p>
                </div>
                <div className="text-center">
                    <p className="font-semibold text-gray-900">
                        {recommendation.total_wins}
                    </p>
                    <p className="text-gray-600">Total Menang</p>
                </div>
            </div>

            {/* Button Detail Analisis */}
            <div className="flex gap-2 mt-4">
                <button
                    onClick={() => onViewDetail(recommendation)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Eye className="h-4 w-4" />
                    Detail Analisis
                </button>
            </div>

            <div className="text-xs text-gray-400 mt-2">
                Skor: {recommendation.recommendation_score} | Label:{" "}
                {recommendation.recommendation_label}
            </div>
        </div>
    );
};

export default function RecommendationsIndex() {
    // Ambil props dari Inertia
    const {
        competitions: competitionsProp = [],
        categories: categoriesProp = [],
        skills: skillsProp = [],
        selectedCompetition: selectedCompetitionProp = null,
        recommendations: recommendationsProp = []
    } = usePage().props as any;

    const [competitions, setCompetitions] =
        useState<Competition[]>(competitionsProp);
    const [categories, setCategories] = useState<Category[]>(categoriesProp);
    const [skills, setSkills] = useState<Skill[]>(skillsProp);
    const [selectedCompetition, setSelectedCompetition] =
        useState<Competition | null>(selectedCompetitionProp);
    const [recommendations, setRecommendations] =
        useState<Recommendation[]>(recommendationsProp);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [teamMembers, setTeamMembers] = useState<number[]>([]);

    // Sync state jika props berubah (navigasi Inertia)
    useEffect(() => {
        setCompetitions(competitionsProp);
        setCategories(categoriesProp);
        setSkills(skillsProp);
        setSelectedCompetition(selectedCompetitionProp);
        setRecommendations(recommendationsProp);
    }, [
        competitionsProp,
        categoriesProp,
        skillsProp,
        selectedCompetitionProp,
        recommendationsProp
    ]);

    // Fetch recommendations when competition changes
    const handleCompetitionChange = async (competitionId: string) => {
        if (!competitionId) {
            setSelectedCompetition(null);
            setRecommendations([]);
            return;
        }
        setLoading(true);
        try {
            const res = await axios.get("/admin/recommendations/get", {
                params: { competition_id: competitionId }
            });
            setSelectedCompetition(res.data.competition);
            setRecommendations(res.data.recommendations || []);
        } catch (error) {
            setRecommendations([]);
            setSelectedCompetition(null);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        if (!selectedCompetition) return;
        try {
            window.open(
                `/admin/recommendations/export?competition_id=${selectedCompetition.id}`,
                "_blank"
            );
        } catch (error) {
            console.error("Error exporting data:", error);
        }
    };

    const handleViewDetail = (recommendation: Recommendation) => {
        if (!selectedCompetition) return;

        // Navigasi ke halaman detail analisis menggunakan Inertia
        window.location.href = `/admin/recommendations/analysis?mahasiswa_id=${recommendation.id}&competition_id=${selectedCompetition.id}`;

        // Atau jika menggunakan Inertia router:
        // import { router } from '@inertiajs/react';
        // router.get('/admin/recommendations/analysis', {
        //     mahasiswa_id: recommendation.id,
        //     competition_id: selectedCompetition.id
        // });
    };

    const filteredRecommendations = recommendations.filter(
        (rec) =>
            rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rec.identifier.includes(searchTerm) ||
            rec.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = [
        {
            label: "Total Kandidat",
            value: recommendations.length,
            icon: Users,
            color: "blue" as const
        },
        {
            label: "Sangat Direkomendasikan",
            value: recommendations.filter(
                (r) => r.recommendation_label === "Sangat Direkomendasikan"
            ).length,
            icon: Trophy,
            color: "green" as const
        },
        {
            label: "Dipertimbangkan",
            value: recommendations.filter(
                (r) => r.recommendation_label === "Dipertimbangkan"
            ).length,
            icon: Target,
            color: "orange" as const
        },
        {
            label: "Rata-rata Skor",
            value:
                recommendations.length > 0
                    ? (
                          recommendations.reduce(
                              (sum, r) => sum + r.recommendation_score,
                              0
                          ) / recommendations.length
                      ).toFixed(1)
                    : "0",
            icon: TrendingUp,
            color: "purple" as const
        }
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Sistem Rekomendasi Peserta
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola dan analisis rekomendasi mahasiswa untuk
                            kompetisi
                        </p>
                    </div>
                </div>

                {/* Competition Selection */}
                <div className="bg-white rounded-xl border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Pilih Kompetisi
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onChange={(e) => {
                                    setTeamMembers([]);
                                    handleCompetitionChange(e.target.value);
                                }}
                                value={
                                    selectedCompetition?.id
                                        ? String(selectedCompetition.id)
                                        : ""
                                }
                            >
                                <option value="">Pilih Kompetisi...</option>
                                {competitions.map((competition) => (
                                    <option
                                        key={competition.id}
                                        value={String(competition.id)}
                                    >
                                        {competition.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {selectedCompetition && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-900">
                                {selectedCompetition.name}
                            </h3>
                            <p className="text-sm text-blue-700 mt-1">
                                Kategori: {selectedCompetition.category.name}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedCompetition.skills.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {selectedCompetition && (
                    <>
                        {/* Statistics */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, index) => (
                                <StatCard
                                    key={index}
                                    label={stat.label}
                                    value={stat.value}
                                    icon={stat.icon}
                                    color={stat.color}
                                />
                            ))}
                        </div>

                        {/* Search and Filters */}
                        <div className="bg-white rounded-xl border p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan nama, NIM, atau email..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                    <Filter className="h-4 w-4" />
                                    Filter
                                </button>
                            </div>
                        </div>

                        {/* Recommendations List */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Hasil Rekomendasi (
                                    {filteredRecommendations.length})
                                </h2>

                                {teamMembers.length > 0 && (
                                    <Button asChild>
                                        <Link
                                            href={route(
                                                "admin.competitions.addTeam",
                                                {
                                                    id: selectedCompetition.id,
                                                    team_members:
                                                        teamMembers.join(",")
                                                }
                                            )}
                                        >
                                            Buat Tim
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600 mt-2">
                                        Memuat rekomendasi...
                                    </p>
                                </div>
                            ) : filteredRecommendations.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredRecommendations.map(
                                        (recommendation) => (
                                            <RecommendationCard
                                                setTeamMembers={setTeamMembers}
                                                teamMembers={teamMembers}
                                                key={recommendation.id}
                                                recommendation={recommendation}
                                                onViewDetail={handleViewDetail}
                                            />
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">
                                        {searchTerm
                                            ? "Tidak ada hasil yang sesuai dengan pencarian"
                                            : "Belum ada data rekomendasi"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {!selectedCompetition && (
                    <div className="text-center py-12">
                        <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Pilih Kompetisi
                        </h3>
                        <p className="text-gray-600">
                            Pilih kompetisi untuk melihat rekomendasi mahasiswa
                        </p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
