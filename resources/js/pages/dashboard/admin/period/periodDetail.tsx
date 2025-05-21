import AdminLayout from "@/components/layouts/adminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, ListX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";

interface Competition {
    id: number;
    name: string;
    description: string;
}

interface PeriodDetailProps {
    period: { id: number; name: string; year: string };
    competitionList: Competition[];
}

export default function PeriodDetail({
    period = { id: 1, name: "Ganjil", year: "2025" },
    competitionList = [
        // Dummy data lomba
        {
            id: 1,
            name: "Olimpiade Matematika",
            description: "Kompetisi matematika tingkat nasional."
        },
        {
            id: 2,
            name: "Lomba Debat Bahasa Inggris",
            description: "Debat bahasa Inggris antar universitas."
        }
    ]
}: PeriodDetailProps) {
    return (
        <AdminLayout>
            <div className="container mx-auto py-6 px-4">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        onClick={() => router.visit("/period")}
                        className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500 hover:text-purple-900 transition-colors duration-200"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* Header Section */}
                    <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all rounded-2xl bg-gradient-to-br from-white to-purple-50/20">
                        <CardContent className="flex items-center gap-6 p-8">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 via-purple-200 to-white shadow-[0_2px_16px_rgba(168,85,247,0.10)]">
                                <Trophy className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-purple-900 mb-1 tracking-tight">
                                    {period.name} ({period.year})
                                </h1>
                                <Badge
                                    variant="secondary"
                                    className="bg-white text-purple-700 border border-purple-200 px-3 py-1 text-sm font-semibold shadow-[0_2px_8px_rgba(168,85,247,0.08)]"
                                >
                                    {competitionList.length} Lomba
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Competition List Section */}
                    <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all bg-white rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Daftar Lomba
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {competitionList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
                                    <ListX className="w-12 h-12 text-purple-200 mb-2" />
                                    <div className="text-lg font-semibold">
                                        Belum ada lomba di periode ini
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Silakan tambahkan lomba untuk periode
                                        ini!
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {competitionList.map((comp) => (
                                        <div
                                            key={comp.id}
                                            className="flex flex-row justify-between items-center p-6 rounded-xl bg-white border border-purple-100 shadow-[0_2px_16px_rgba(168,85,247,0.06)] hover:shadow-[0_4px_24px_rgba(168,85,247,0.12)] transition-all w-full gap-8"
                                        >
                                            <div className="flex flex-row items-center gap-6 min-w-0 flex-1">
                                                <span className="font-bold text-lg text-gray-900 truncate">
                                                    {comp.name}
                                                </span>
                                                <div className="text-sm text-gray-500 min-w-0 truncate">
                                                    {comp.description}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
