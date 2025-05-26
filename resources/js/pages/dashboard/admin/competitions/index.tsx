import AdminLayout from "@/components/layouts/adminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/shared/dataTable";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Award, Calendar, CheckCircle, Clock, Trophy } from "lucide-react";
import { useCallback, useState } from "react";
import { competitionColumns } from "./competition-table/columns";
import DeleteCompetitionModal from "./competition-table/deleteCompetitionModal";
import StatCard from "@/components/ui/admin/dashboard/statCard";
import "@/../css/dashboard-admin.css";

enum CompetitionFilterTable {
    ALL = "all",
    ONGOING = "ongoing",
    COMPLETED = "completed",
    PENDING = "pending"
}

type Props = {
    ongoing: number;
    completed: number;
    pending: number;
    total: number;
};

export default function Competitions({
    ongoing,
    completed,
    pending,
    total
}: Props) {
    const [competitionStatus, setCompetitionStatus] =
        useState<CompetitionFilterTable>(CompetitionFilterTable.ALL);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [competitionId, setCompetitionId] = useState(0);

    const [page, setPage] = useState(1);

    const competitions = useQuery({
        queryKey: ["competitions", competitionStatus, page],

        queryFn: async () => {
            const statusParams =
                competitionStatus === CompetitionFilterTable.PENDING
                    ? { verif_status: CompetitionFilterTable.PENDING }
                    : { status: competitionStatus };

            const res = await axios.get(route("admin.competitions.getAll"), {
                params: {
                    page,
                    limit: 4,
                    ...(competitionStatus !== CompetitionFilterTable.ALL &&
                        statusParams)
                }
            });
            return res.data;
        }
    });

    const setFilter = (status: CompetitionFilterTable) => {
        setCompetitionStatus(status);
        setPage(1);
    };

    const columns = useCallback(() => {
        return competitionColumns(setOpenDeleteModal, setCompetitionId);
    }, []);

    return (
        <AdminLayout title="Manajemen Kompetisi">
            <div className="container mx-auto py-8">
                <div className="inline-flex w-full justify-between items-end">
                    <div className="flex items-center gap-2">
                        <Trophy className="h-8 w-8 text-purple-600" />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                Kompetisi Dashboard
                            </h1>
                            <p className="text-muted-foreground">
                                Kelola semua kompetisi dalam satu tempat
                            </p>
                        </div>
                    </div>
                    <Button
                        asChild
                        className="bg-purple-600 hover:bg-purple-700 rounded-md"
                    >
                        <Link href={route("admin.competitions.create")}>
                            Tambah Lomba
                        </Link>
                    </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-2">
                    <StatCard
                        label="Total Kompetisi"
                        value={total}
                        icon={<Award className="h-6 w-6 text-purple-600" />}
                    />
                    <StatCard
                        label="Sedang Berlangsung"
                        value={ongoing}
                        icon={<Clock className="h-6 w-6 text-green-500" />}
                    />
                    <StatCard
                        label="Selesai"
                        value={completed}
                        icon={<CheckCircle className="h-6 w-6 text-blue-500" />}
                    />
                    <StatCard
                        label="Menunggu Verifikasi"
                        value={pending}
                        icon={<Calendar className="h-6 w-6 text-yellow-500" />}
                    />
                </div>
                <div className="mt-6 p-1 rounded inline-flex gap-2">
                    <Button
                        onClick={() => setFilter(CompetitionFilterTable.ALL)}
                        size="sm"
                        className={cn(
                            "rounded-lg border-2 px-5 py-2 font-semibold transition-all duration-200 focus:outline-none",
                            competitionStatus === CompetitionFilterTable.ALL
                                ? "bg-white text-purple-700 border-purple-400 ring-2 ring-purple-100 hover:scale-105"
                                : "bg-transparent text-gray-500 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 hover:scale-105"
                        )}
                    >
                        Semua
                    </Button>
                    <Button
                        onClick={() =>
                            setFilter(CompetitionFilterTable.ONGOING)
                        }
                        size="sm"
                        className={cn(
                            "rounded-lg  border-2 px-5 py-2 font-semibold transition-all duration-200 focus:outline-none",
                            competitionStatus === CompetitionFilterTable.ONGOING
                                ? "bg-white text-purple-700 border-purple-400 ring-2 ring-purple-100 hover:scale-105 hover:shadow-lg"
                                : "bg-transparent text-gray-500 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 hover:scale-105"
                        )}
                    >
                        Sedang Berlangsung
                    </Button>
                    <Button
                        onClick={() =>
                            setFilter(CompetitionFilterTable.COMPLETED)
                        }
                        size="sm"
                        className={cn(
                            "rounded-lg  border-2 px-5 py-2 font-semibold transition-all duration-200 focus:outline-none",
                            competitionStatus ===
                                CompetitionFilterTable.COMPLETED
                                ? "bg-white text-purple-700 border-purple-400 ring-2 ring-purple-100 hover:scale-105 hover:shadow-lg"
                                : "bg-transparent text-gray-500 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 hover:scale-105"
                        )}
                    >
                        Selesai
                    </Button>
                    <Button
                        onClick={() =>
                            setFilter(CompetitionFilterTable.PENDING)
                        }
                        size="sm"
                        className={cn(
                            "rounded-lg  border-2 px-5 py-2 font-semibold transition-all duration-200 focus:outline-none",
                            competitionStatus === CompetitionFilterTable.PENDING
                                ? "bg-white text-purple-700 border-purple-400 ring-2 ring-purple-100 hover:scale-105 hover:shadow-lg"
                                : "bg-transparent text-gray-500 border-gray-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 hover:scale-105"
                        )}
                    >
                        Menunggu Verifikasi
                    </Button>
                </div>
                <div className="w-full mt-6 p-1 bg-white inline-flex gap-2 rounded-xl overflow-hidden border overflow-x-auto">
                    {competitions.isLoading && (
                        <div className="flex items-center justify-center w-full h-96">
                            <p className="text-muted-foreground">Loading...</p>
                        </div>
                    )}

                    {competitions.isSuccess && competitions.data.data && (
                        <DataTable
                            columns={columns()}
                            data={competitions.data.data}
                        />
                    )}

                    {competitions.isError && (
                        <div className="flex items-center justify-center w-full h-96">
                            <p className="text-muted-foreground">
                                Terjadi kesalahan saat memuat data kompetisi
                            </p>
                        </div>
                    )}
                </div>

                <div className="w-full inline-flex justify-between items-center mt-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Halaman {competitions.data?.pagination.current_page}{" "}
                            dari {competitions.data?.pagination.last_page} |
                            Total Data:{" "}
                            {competitions.data?.pagination.total}{" "}
                        </p>
                    </div>

                    <div className="inline-flex gap-2">
                        <Button
                            disabled={
                                +competitions.data?.pagination.current_page ===
                                1
                            }
                            onClick={() => {
                                setPage(
                                    +competitions.data?.pagination
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
                                +competitions.data?.pagination.current_page ===
                                +competitions.data?.pagination.last_page
                            }
                            onClick={() => {
                                setPage(
                                    +competitions.data?.pagination
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
            {openDeleteModal && (
                <DeleteCompetitionModal
                    competitionId={competitionId}
                    open={openDeleteModal}
                    onOpenChange={setOpenDeleteModal}
                    refetch={competitions.refetch}
                />
            )}
        </AdminLayout>
    );
}
