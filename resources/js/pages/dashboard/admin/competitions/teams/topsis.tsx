import AdminLayout from "@/components/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Info } from "lucide-react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";

type Props = {
    topsisDetails: {
        alternatives: Array<{
            id: number;
            name: string;
            skill_match: number;
            skill_level: number;
            wins: number;
            competitions: number;
            experience: number;
            skill_details: {
                total_skills: number;
                matching_skills: number;
                required_skills: number;
                skill_levels: Array<{
                    skill_id: number;
                    level: string;
                    score: number;
                }>;
                level_distribution: {
                    beginner: number;
                    intermediate: number;
                    advanced: number;
                    expert: number;
                    master: number;
                };
            };
        }>;
        weights: {
            skills: number;
            wins: number;
            competitions: number;
            experience: number;
        };
        criteria: {
            [key: string]: {
                name: string;
                description: string;
                weight: number;
            };
        };
        decisionMatrix: number[][];
        normalizedMatrix: number[][];
        weightedMatrix: number[][];
        idealSolution: number[];
        negativeIdealSolution: number[];
        distances: Array<{
            positive: number;
            negative: number;
        }>;
        preferences: number[];
        rankedRecommendations: Array<{
            name: string;
            score: number;
        }>;
    };
};

export default function TopsisDetail({ topsisDetails }: Props) {
    return (
        <AdminLayout>
            <div className="container py-8">
                <div className="mb-6">
                    <Button
                        onClick={() => window.history.back()}
                        variant="ghost"
                        className="pl-0 flex items-center gap-2 mb-4"
                    >
                        <ArrowLeft size={16} />
                        <span>Kembali</span>
                    </Button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Calculator className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Detail Perhitungan SPK TOPSIS
                            </h1>
                            <p className="text-muted-foreground">
                                Detail perhitungan metode TOPSIS untuk
                                rekomendasi dosen pembimbing
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6">
                    {/* Kriteria dan Bobot */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kriteria dan Bobot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(topsisDetails.criteria).map(
                                    ([key, criteria]) => (
                                        <div
                                            key={key}
                                            className="p-4 bg-purple-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-medium">
                                                    {criteria.name}
                                                </h3>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Info className="h-4 w-4 text-muted-foreground" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                {
                                                                    criteria.description
                                                                }
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <p className="text-2xl font-bold text-purple-600">
                                                {criteria.weight * 100}%
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Awal */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Awal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left p-2">
                                                Dosen
                                            </th>
                                            <th className="text-left p-2">
                                                Kecocokan Skill
                                            </th>
                                            <th className="text-left p-2">
                                                Level Skill
                                            </th>
                                            <th className="text-left p-2">
                                                Jumlah Kemenangan
                                            </th>
                                            <th className="text-left p-2">
                                                Jumlah Kompetisi
                                            </th>
                                            <th className="text-left p-2">
                                                Pengalaman
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topsisDetails.decisionMatrix.map(
                                            (row, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-t"
                                                >
                                                    <td className="p-2">
                                                        {
                                                            topsisDetails
                                                                .alternatives[i]
                                                                .name
                                                        }
                                                    </td>
                                                    {row.map((value, j) => (
                                                        <td
                                                            key={j}
                                                            className="p-2"
                                                        >
                                                            {j === 0 ? (
                                                                <div>
                                                                    <div>
                                                                        {value.toFixed(
                                                                            2
                                                                        )}
                                                                    </div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {
                                                                            topsisDetails
                                                                                .alternatives[
                                                                                i
                                                                            ]
                                                                                .skill_details
                                                                                .matching_skills
                                                                        }
                                                                        /
                                                                        {
                                                                            topsisDetails
                                                                                .alternatives[
                                                                                i
                                                                            ]
                                                                                .skill_details
                                                                                .required_skills
                                                                        }{" "}
                                                                        skill
                                                                    </div>
                                                                </div>
                                                            ) : j === 1 ? (
                                                                <div>
                                                                    <div>
                                                                        {value.toFixed(
                                                                            2
                                                                        )}
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        <details className="text-xs">
                                                                            <summary className="cursor-pointer text-purple-600 hover:text-purple-700">
                                                                                Detail
                                                                                Level
                                                                                Skill
                                                                            </summary>
                                                                            <div className="mt-2 space-y-2">
                                                                                <div className="space-y-1">
                                                                                    {Object.entries(
                                                                                        topsisDetails
                                                                                            .alternatives[
                                                                                            i
                                                                                        ]
                                                                                            .skill_details
                                                                                            .level_distribution
                                                                                    ).map(
                                                                                        ([
                                                                                            level,
                                                                                            count
                                                                                        ]) =>
                                                                                            count >
                                                                                                0 && (
                                                                                                <div
                                                                                                    key={
                                                                                                        level
                                                                                                    }
                                                                                                    className="flex items-center justify-between"
                                                                                                >
                                                                                                    <span className="capitalize">
                                                                                                        {
                                                                                                            level
                                                                                                        }
                                                                                                    </span>
                                                                                                    <span className="text-muted-foreground">
                                                                                                        {
                                                                                                            count
                                                                                                        }{" "}
                                                                                                        skill
                                                                                                    </span>
                                                                                                </div>
                                                                                            )
                                                                                    )}
                                                                                </div>
                                                                                <div className="pt-2 border-t">
                                                                                    <div className="font-medium mb-1">
                                                                                        Detail
                                                                                        Skill:
                                                                                    </div>
                                                                                    {topsisDetails.alternatives[
                                                                                        i
                                                                                    ].skill_details.skill_levels.map(
                                                                                        (
                                                                                            skill,
                                                                                            idx
                                                                                        ) => (
                                                                                            <div
                                                                                                key={
                                                                                                    idx
                                                                                                }
                                                                                                className="flex items-center justify-between"
                                                                                            >
                                                                                                <span className="capitalize">
                                                                                                    {
                                                                                                        skill.level
                                                                                                    }
                                                                                                </span>
                                                                                                <span className="text-muted-foreground">
                                                                                                    Score:{" "}
                                                                                                    {
                                                                                                        skill.score
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        )
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </details>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                value.toFixed(0)
                                                            )}
                                                        </td>
                                                    ))}
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Matriks Normalisasi */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Matriks Normalisasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left p-2">
                                                Dosen
                                            </th>
                                            <th className="text-left p-2">
                                                Kecocokan Skill
                                            </th>
                                            <th className="text-left p-2">
                                                Level Skill
                                            </th>
                                            <th className="text-left p-2">
                                                Jumlah Kemenangan
                                            </th>
                                            <th className="text-left p-2">
                                                Jumlah Kompetisi
                                            </th>
                                            <th className="text-left p-2">
                                                Pengalaman
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topsisDetails.normalizedMatrix.map(
                                            (row, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-t"
                                                >
                                                    <td className="p-2">
                                                        {
                                                            topsisDetails
                                                                .alternatives[i]
                                                                .name
                                                        }
                                                    </td>
                                                    {row.map((value, j) => (
                                                        <td
                                                            key={j}
                                                            className="p-2"
                                                        >
                                                            {value.toFixed(4)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Matriks Terbobot */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Matriks Terbobot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left p-2">
                                                Dosen
                                            </th>
                                            <th className="text-left p-2">
                                                Kecocokan Skill
                                            </th>
                                            <th className="text-left p-2">
                                                Level Skill
                                            </th>
                                            <th className="text-left p-2">
                                                Jumlah Kemenangan
                                            </th>
                                            <th className="text-left p-2">
                                                Jumlah Kompetisi
                                            </th>
                                            <th className="text-left p-2">
                                                Pengalaman
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topsisDetails.weightedMatrix.map(
                                            (row, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-t"
                                                >
                                                    <td className="p-2">
                                                        {
                                                            topsisDetails
                                                                .alternatives[i]
                                                                .name
                                                        }
                                                    </td>
                                                    {row.map((value, j) => (
                                                        <td
                                                            key={j}
                                                            className="p-2"
                                                        >
                                                            {value.toFixed(4)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Solusi Ideal */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Solusi Ideal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <h3 className="font-medium mb-2">
                                        Solusi Ideal Positif
                                    </h3>
                                    <div className="space-y-1">
                                        <p>
                                            Kecocokan Skill:{" "}
                                            {topsisDetails.idealSolution[0].toFixed(
                                                4
                                            )}
                                        </p>
                                        <p>
                                            Jumlah Kemenangan:{" "}
                                            {topsisDetails.idealSolution[1].toFixed(
                                                4
                                            )}
                                        </p>
                                        <p>
                                            Jumlah Kompetisi:{" "}
                                            {topsisDetails.idealSolution[2].toFixed(
                                                4
                                            )}
                                        </p>
                                        <p>
                                            Pengalaman:{" "}
                                            {topsisDetails.idealSolution[3].toFixed(
                                                4
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <h3 className="font-medium mb-2">
                                        Solusi Ideal Negatif
                                    </h3>
                                    <div className="space-y-1">
                                        <p>
                                            Kecocokan Skill:{" "}
                                            {topsisDetails.negativeIdealSolution[0].toFixed(
                                                4
                                            )}
                                        </p>
                                        <p>
                                            Jumlah Kemenangan:{" "}
                                            {topsisDetails.negativeIdealSolution[1].toFixed(
                                                4
                                            )}
                                        </p>
                                        <p>
                                            Jumlah Kompetisi:{" "}
                                            {topsisDetails.negativeIdealSolution[2].toFixed(
                                                4
                                            )}
                                        </p>
                                        <p>
                                            Pengalaman:{" "}
                                            {topsisDetails.negativeIdealSolution[3].toFixed(
                                                4
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hasil Akhir */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Hasil Akhir</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr>
                                            <th className="text-left p-2">
                                                Dosen
                                            </th>
                                            <th className="text-left p-2">
                                                D+
                                            </th>
                                            <th className="text-left p-2">
                                                D-
                                            </th>
                                            <th className="text-left p-2">
                                                Preferensi
                                            </th>
                                            <th className="text-left p-2">
                                                Rangking
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topsisDetails.rankedRecommendations.map(
                                            (alt, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-t"
                                                >
                                                    <td className="p-2">
                                                        {alt.name}
                                                    </td>
                                                    <td className="p-2">
                                                        {topsisDetails.distances[
                                                            i
                                                        ]?.positive.toFixed(4)}
                                                    </td>
                                                    <td className="p-2">
                                                        {topsisDetails.distances[
                                                            i
                                                        ]?.negative.toFixed(4)}
                                                    </td>
                                                    <td className="p-2">
                                                        {alt.score.toFixed(2)}
                                                    </td>
                                                    <td className="p-2 font-medium">
                                                        {i + 1}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
