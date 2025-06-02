import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DosenLayout from "@/components/layouts/dosenLayout";
import { Button } from "@/components/ui/button";
import { Award, Calendar, CheckCircle, Clock, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import DataTable from "@/components/ui/shared/dataTable";
import { achievementColumns } from "./achievement-table/columns";
import { cn } from "@/lib/utils";

enum AchievementFilterTable {
    ALL = "all",
    WIN = "win",
    LOSE = "lose"
}

type Props = {
    stats: {
        total: number;
        wins: number;
        ongoing: number;
        pending: number;
    };
};

export default function Achievements({ stats }: Props) {
    const [achievementStatus, setAchievementStatus] =
        useState<AchievementFilterTable>(AchievementFilterTable.ALL);
    const [page, setPage] = useState(1);

    const achievements = useQuery({
        queryKey: ["achievements", achievementStatus, page],
        queryFn: async () => {
            const res = await axios.get(route("dosen.achievements.getAll"), {
                params: {
                    page,
                    limit: 10,
                    status: achievementStatus
                }
            });
            return res.data;
        }
    });

    const setFilter = (status: AchievementFilterTable) => {
        setAchievementStatus(status);
        setPage(1);
    };

    return (
        <DosenLayout>
            <div className="container mx-auto py-8">
                <div className="inline-flex w-full justify-between items-end">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-8 w-8 text-purple-600" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Prestasi Mahasiswa
                            </h1>
                            <p className="text-muted-foreground">
                                Kelola prestasi mahasiswa bimbingan
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Bimbingan
                            </CardTitle>
                            <Award className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total mahasiswa yang dibimbing
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Prestasi
                            </CardTitle>
                            <Trophy className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.wins}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total prestasi yang diraih
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sedang Berlangsung
                            </CardTitle>
                            <Clock className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.ongoing}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Bimbingan yang sedang berlangsung
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Menunggu Verifikasi
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.pending}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Prestasi yang perlu diverifikasi
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 p-1 rounded bg-muted inline-flex gap-2">
                    <Button
                        onClick={() => setFilter(AchievementFilterTable.ALL)}
                        size="sm"
                        className={cn("rounded", {
                            "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                achievementStatus ===
                                AchievementFilterTable.ALL,
                            "bg-muted text-black/50 hover:bg-muted":
                                achievementStatus !== AchievementFilterTable.ALL
                        })}
                    >
                        Semua
                    </Button>
                    <Button
                        onClick={() => setFilter(AchievementFilterTable.WIN)}
                        size="sm"
                        className={cn("rounded", {
                            "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                achievementStatus ===
                                AchievementFilterTable.WIN,
                            "bg-muted text-black/50 hover:bg-muted":
                                achievementStatus !== AchievementFilterTable.WIN
                        })}
                    >
                        Menang
                    </Button>
                    <Button
                        onClick={() => setFilter(AchievementFilterTable.LOSE)}
                        size="sm"
                        className={cn("rounded", {
                            "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                achievementStatus ===
                                AchievementFilterTable.LOSE,
                            "bg-muted text-black/50 hover:bg-muted":
                                achievementStatus !==
                                AchievementFilterTable.LOSE
                        })}
                    >
                        Kalah
                    </Button>
                </div>

                <div className="w-full mt-6 p-1 bg-white inline-flex gap-2 rounded-xl overflow-hidden border overflow-x-auto">
                    {achievements.isLoading && (
                        <div className="flex items-center justify-center w-full h-96">
                            <p className="text-muted-foreground">Loading...</p>
                        </div>
                    )}

                    {achievements.isSuccess && achievements.data.data && (
                        <DataTable
                            columns={achievementColumns()}
                            data={achievements.data.data}
                        />
                    )}

                    {achievements.isError && (
                        <div className="flex items-center justify-center w-full h-96">
                            <p className="text-muted-foreground">
                                Terjadi kesalahan saat memuat data prestasi
                            </p>
                        </div>
                    )}
                </div>

                <div className="w-full inline-flex justify-between items-center mt-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Halaman {achievements.data?.pagination.current_page}{" "}
                            dari {achievements.data?.pagination.last_page} |
                            Total Data:{" "}
                            {achievements.data?.pagination.total}{" "}
                        </p>
                    </div>

                    <div className="inline-flex gap-2">
                        <Button
                            disabled={
                                +achievements.data?.pagination.current_page ===
                                1
                            }
                            onClick={() => {
                                setPage(
                                    +achievements.data?.pagination
                                        .current_page - 1
                                );
                            }}
                            variant="outline"
                            size="sm"
                        >
                            Sebelumnya
                        </Button>
                        <Button
                            disabled={
                                +achievements.data?.pagination.current_page ===
                                +achievements.data?.pagination.last_page
                            }
                            onClick={() => {
                                setPage(
                                    +achievements.data?.pagination
                                        .current_page + 1
                                );
                            }}
                            variant="outline"
                            size="sm"
                        >
                            Selanjutnya
                        </Button>
                    </div>
                </div>
            </div>
        </DosenLayout>
    );
}
