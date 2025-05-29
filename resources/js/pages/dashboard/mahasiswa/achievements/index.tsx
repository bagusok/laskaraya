import MahasiswaLayout from "@/components/layouts/mahasiswaLayout";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { mahasiswaAchievementColumns } from "./columns";
import useAuth from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DataTable from "@/components/ui/shared/dataTable";
import { cn } from "@/lib/utils";

enum MahasiswaAchievementStatus {
    ALL = "all",
    WIN = "win",
    LOSE = "lose",
    UNKNOWN = "unknown",
    VERIFY_PENDING = "verify_pending",
    VERIFY_REJECTED = "verify_rejected"
}

export default function AchievementsPage() {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [achievementStatus, setAchievementStatus] =
        useState<MahasiswaAchievementStatus>(MahasiswaAchievementStatus.ALL);

    const { user } = useAuth();

    const [page, setPage] = useState(1);

    const columns = useCallback(
        () =>
            mahasiswaAchievementColumns(
                setOpenDeleteModal,
                setId,
                user?.id ?? 0
            ),
        [user?.id]
    );

    const achievements = useQuery({
        queryKey: ["achievements", page, achievementStatus],
        queryFn: async () =>
            axios
                .get(
                    route("mahasiswa.achievements.getAll", {
                        page,
                        status: achievementStatus
                    })
                )
                .then((res) => res.data)
                .catch((err) => {
                    throw new Error(
                        err.response?.data?.message ||
                            "Failed to fetch achievements"
                    );
                })
    });

    const setFilter = (status: MahasiswaAchievementStatus) => {
        setAchievementStatus(status);
        setPage(1);
        achievements.refetch();
    };

    return (
        <MahasiswaLayout title="Riwayat Prestasi">
            <div className="w-full inline-flex justify-between items-center">
                <div></div>
                <Button asChild>
                    <Link href={route("mahasiswa.achievements.create")}>
                        Tambah Prestasi
                    </Link>
                </Button>
            </div>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>List Prestasi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <div className="mb-6 p-1 rounded inline-flex gap-2">
                            <Button
                                onClick={() =>
                                    setFilter(MahasiswaAchievementStatus.ALL)
                                }
                                size="sm"
                                className={cn(
                                    "rounded-lg border-2 px-5 py-2 font-semibold transition-all duration-200 focus:outline-none",
                                    achievementStatus ===
                                        MahasiswaAchievementStatus.ALL
                                        ? "bg-white text-purple-700 border-purple-400 shadow-md ring-2 ring-purple-100 hover:scale-105"
                                        : "bg-transparent text-gray-500 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 hover:scale-105"
                                )}
                            >
                                Semua
                            </Button>
                            <Button
                                onClick={() =>
                                    setFilter(MahasiswaAchievementStatus.WIN)
                                }
                                size="sm"
                                className={cn(
                                    "rounded-lg border-2 px-5 py-2 font-semibold transition-all duration-200 focus:outline-none",
                                    achievementStatus ===
                                        MahasiswaAchievementStatus.WIN
                                        ? "bg-white text-purple-700 border-purple-400 shadow-md ring-2 ring-purple-100 hover:scale-105"
                                        : "bg-transparent text-gray-500 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 hover:scale-105"
                                )}
                            >
                                Menang
                            </Button>
                            <Button
                                onClick={() =>
                                    setFilter(MahasiswaAchievementStatus.LOSE)
                                }
                                size="sm"
                                className={cn(
                                    "rounded-lg border-2 px-5 py-2 font-semibold transition-all duration-200 focus:outline-none",
                                    achievementStatus ===
                                        MahasiswaAchievementStatus.LOSE
                                        ? "bg-white text-purple-700 border-purple-400 shadow-md ring-2 ring-purple-100 hover:scale-105"
                                        : "bg-transparent text-gray-500 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 hover:scale-105"
                                )}
                            >
                                Kalah
                            </Button>
                            <Button
                                onClick={() =>
                                    setFilter(
                                        MahasiswaAchievementStatus.UNKNOWN
                                    )
                                }
                                size="sm"
                                className={cn(
                                    "rounded-lg border-2 px-5 py-2 font-semibold transition-all duration-200 focus:outline-none",
                                    achievementStatus ===
                                        MahasiswaAchievementStatus.UNKNOWN
                                        ? "bg-white text-purple-700 border-purple-400 shadow-md ring-2 ring-purple-100 hover:scale-105"
                                        : "bg-transparent text-gray-500 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 hover:scale-105"
                                )}
                            >
                                Belum Diisi
                            </Button>
                            <Button
                                onClick={() =>
                                    setFilter(
                                        MahasiswaAchievementStatus.VERIFY_PENDING
                                    )
                                }
                                size="sm"
                                className={cn(
                                    "rounded-lg border-2 px-5 py-2 font-semibold transition-all duration-200 focus:outline-none",
                                    achievementStatus ===
                                        MahasiswaAchievementStatus.VERIFY_PENDING
                                        ? "bg-white text-purple-700 border-purple-400 shadow-md ring-2 ring-purple-100 hover:scale-105"
                                        : "bg-transparent text-gray-500 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 hover:scale-105"
                                )}
                            >
                                Menunggu Verifikasi
                            </Button>
                            <Button
                                onClick={() =>
                                    setFilter(
                                        MahasiswaAchievementStatus.VERIFY_REJECTED
                                    )
                                }
                                size="sm"
                                className={cn(
                                    "rounded-lg border-2 px-5 py-2 font-semibold transition-all duration-200 focus:outline-none",
                                    achievementStatus ===
                                        MahasiswaAchievementStatus.VERIFY_REJECTED
                                        ? "bg-white text-purple-700 border-purple-400 shadow-md ring-2 ring-purple-100 hover:scale-105"
                                        : "bg-transparent text-gray-500 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 hover:scale-105"
                                )}
                            >
                                Verifikasi Ditolak
                            </Button>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        {achievements.isLoading && (
                            <div className="flex justify-center items-center h-64">
                                <span>Loading...</span>
                            </div>
                        )}

                        {achievements.isError && (
                            <div className="flex justify-center items-center h-64">
                                <span className="text-red-600">
                                    {achievements.error.message}
                                </span>
                            </div>
                        )}

                        {achievements.isSuccess && (
                            <DataTable
                                columns={columns()}
                                data={achievements.data.data}
                            />
                        )}
                    </div>

                    <div className="w-full inline-flex justify-between items-center mt-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Halaman {achievements.data?.current_page} dari{" "}
                                {achievements.data?.last_page} | Total Data:{" "}
                                {achievements.data?.total}{" "}
                            </p>
                        </div>

                        <div className="inline-flex gap-2">
                            <Button
                                disabled={
                                    +achievements.data?.current_page === 1
                                }
                                onClick={() => {
                                    setPage(
                                        +achievements.data?.current_page - 1
                                    );
                                }}
                                variant="outline"
                                size="sm"
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                disabled={
                                    +achievements.data?.current_page ===
                                    +achievements.data?.last_page
                                }
                                onClick={() => {
                                    setPage(
                                        +achievements.data?.current_page + 1
                                    );
                                }}
                                variant="outline"
                                size="sm"
                            >
                                Selanjutnya
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </MahasiswaLayout>
    );
}
