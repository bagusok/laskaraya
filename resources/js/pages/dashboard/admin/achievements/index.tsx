import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { mahasiswaAchievementColumns } from "./columns";
import useAuth from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DataTable from "@/components/ui/shared/dataTable";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/layouts/adminLayout";
import DeleteAchievementModal from "./deleteAchievementModal";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { FileDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

enum MahasiswaAchievementStatus {
    ALL = "all",
    WIN = "win",
    LOSE = "lose",
    UNKNOWN = "unknown",
    VERIFY_PENDING = "verify_pending",
    VERIFY_REJECTED = "verify_rejected"
}

type Props = {
    periods: {
        id: number;
        name: string;
    }[];
};

export default function AchievementsPage({ periods }: Props) {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [id, setId] = useState<number | null>(null);
    const [achievementStatus, setAchievementStatus] =
        useState<MahasiswaAchievementStatus>(MahasiswaAchievementStatus.ALL);

    const [period, setPeriod] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("all");

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
                    route("admin.achievements.getAll", {
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
        <AdminLayout title="Riwayat Prestasi">
            <Card className="mt-4">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>List Prestasi</CardTitle>
                    <div className="inline-flex">
                        <Dialog>
                            <DialogTrigger>
                                <FileDown
                                    size="20"
                                    className="hover:opacity-70"
                                />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Ekspor ke Excell</DialogTitle>
                                </DialogHeader>
                                <div>
                                    <Label>Periode</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setPeriod(value)
                                        }
                                        value={period ?? "all"}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Periode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periods.map((period) => (
                                                <SelectItem
                                                    key={period.id}
                                                    value={String(period.id)}
                                                >
                                                    {period.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Status</Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setStatus(value)
                                        }
                                        value={status}
                                    >
                                        <SelectTrigger
                                            className="w-full"
                                            defaultValue="all"
                                        >
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Semua
                                            </SelectItem>
                                            <SelectItem value="win">
                                                Menang
                                            </SelectItem>
                                            <SelectItem value="lose">
                                                Kalah
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="default"
                                        className="w-full"
                                        onClick={() => {
                                            window.open(
                                                route(
                                                    "admin.achievements.exportExcel",
                                                    {
                                                        period_id:
                                                            period == "all"
                                                                ? null
                                                                : period,
                                                        status: status
                                                    }
                                                ),
                                                "_blank"
                                            );
                                        }}
                                    >
                                        Ekspor
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
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

            {openDeleteModal && (
                <DeleteAchievementModal
                    id={id ?? 0}
                    open={openDeleteModal}
                    onOpenChange={setOpenDeleteModal}
                    refetch={achievements.refetch}
                />
            )}
        </AdminLayout>
    );
}
