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
import MahasiswaLayout from "@/components/layouts/mahasiswaLayout";
import useAuth from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamTable from "./team-table";
import StatCard from "@/components/ui/admin/dashboard/statCard";
import "@/../css/dashboard-admin.css";

enum CompetitionFilterTable {
    AVAILABLE = "available",
    JOINED_ONGOING = "joined",
    JOINED_COMPLETED = "joined_completed",
    PENDING_VERIFICATION = "pending_verification"
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
        useState<CompetitionFilterTable>(CompetitionFilterTable.AVAILABLE);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [competitionId, setCompetitionId] = useState(0);

    const [page, setPage] = useState(1);
    const { user } = useAuth();

    const competitions = useQuery({
        queryKey: ["competitions", competitionStatus, page],

        queryFn: async () => {
            let statusParams = {};

            switch (competitionStatus) {
                case CompetitionFilterTable.AVAILABLE:
                    statusParams = {
                        verif_status: "accepted",
                        status: "ongoing",
                        type: "competitions"
                    };
                    break;
                case CompetitionFilterTable.JOINED_ONGOING:
                    statusParams = {
                        verif_status: "accepted",
                        type: "mahasiswa_competitions",
                        status: "ongoing"
                    };
                    break;
                case CompetitionFilterTable.JOINED_COMPLETED:
                    statusParams = {
                        verif_status: "accepted",
                        type: "mahasiswa_competitions",
                        status: "completed"
                    };
                    break;
                case CompetitionFilterTable.PENDING_VERIFICATION:
                    statusParams = {
                        verif_status: "pending",
                        type: "competitions",
                        uploader_id: user?.id
                    };
                    break;
                default:
                    statusParams = {};
                    break;
            }

            const res = await axios.get(
                route("mahasiswa.competitions.getAll"),
                {
                    params: {
                        page,
                        limit: 4,
                        ...statusParams
                    }
                }
            );
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
        <MahasiswaLayout>
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
                        className="bg-purple-600 hover:bg-purple-700 rounded"
                    >
                        <Link href={route("mahasiswa.competitions.create")}>
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
                        label="Sedang Diikuti"
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
                <Tabs defaultValue="competitions" className="w-full mt-6">
                    <TabsList>
                        <TabsTrigger value="competitions">
                            Kompetisi
                        </TabsTrigger>
                        <TabsTrigger value="teams">Tim</TabsTrigger>
                    </TabsList>
                    <TabsContent value="competitions">
                        <>
                            <div className="overflow-x-auto">
                                <div className="mt-6 p-1 rounded bg-muted inline-flex gap-2">
                                    <Button
                                        onClick={() =>
                                            setFilter(
                                                CompetitionFilterTable.AVAILABLE
                                            )
                                        }
                                        size="sm"
                                        className={cn("rounded", {
                                            "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                                competitionStatus ===
                                                CompetitionFilterTable.AVAILABLE,
                                            "bg-muted text-black/50 hover:bg-muted":
                                                competitionStatus !==
                                                CompetitionFilterTable.AVAILABLE
                                        })}
                                    >
                                        Kompetisi Tersedia
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            setFilter(
                                                CompetitionFilterTable.JOINED_ONGOING
                                            )
                                        }
                                        size="sm"
                                        className={cn("rounded", {
                                            "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                                competitionStatus ===
                                                CompetitionFilterTable.JOINED_ONGOING,
                                            "bg-muted text-black/50 hover:bg-muted":
                                                competitionStatus !==
                                                CompetitionFilterTable.JOINED_ONGOING
                                        })}
                                    >
                                        Sedang Diikuti
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            setFilter(
                                                CompetitionFilterTable.JOINED_COMPLETED
                                            )
                                        }
                                        size="sm"
                                        className={cn("rounded", {
                                            "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                                competitionStatus ===
                                                CompetitionFilterTable.JOINED_COMPLETED,
                                            "bg-muted text-black/50 hover:bg-muted":
                                                competitionStatus !==
                                                CompetitionFilterTable.JOINED_COMPLETED
                                        })}
                                    >
                                        Selesai Diikuti
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            setFilter(
                                                CompetitionFilterTable.PENDING_VERIFICATION
                                            )
                                        }
                                        size="sm"
                                        className={cn("rounded", {
                                            "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                                competitionStatus ===
                                                CompetitionFilterTable.PENDING_VERIFICATION,
                                            "bg-muted text-black/50 hover:bg-muted":
                                                competitionStatus !==
                                                CompetitionFilterTable.PENDING_VERIFICATION
                                        })}
                                    >
                                        Pengajuan Kompetisi Menunggu Verifikasi
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full mt-6 p-1 bg-white inline-flex gap-2 rounded-xl overflow-hidden border overflow-x-auto">
                                {competitions.isLoading && (
                                    <div className="flex items-center justify-center w-full h-96">
                                        <p className="text-muted-foreground">
                                            Loading...
                                        </p>
                                    </div>
                                )}

                                {competitions.isSuccess &&
                                    competitions.data.data && (
                                        <DataTable
                                            columns={columns()}
                                            data={competitions.data.data}
                                        />
                                    )}

                                {competitions.isError && (
                                    <div className="flex items-center justify-center w-full h-96">
                                        <p className="text-muted-foreground">
                                            Terjadi kesalahan saat memuat data
                                            kompetisi
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="w-full inline-flex justify-between items-center mt-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Halaman{" "}
                                        {
                                            competitions.data?.pagination
                                                .current_page
                                        }{" "}
                                        dari{" "}
                                        {
                                            competitions.data?.pagination
                                                .last_page
                                        }{" "}
                                        | Total Data:{" "}
                                        {
                                            competitions.data?.pagination.total
                                        }{" "}
                                    </p>
                                </div>

                                <div className="inline-flex gap-2">
                                    <Button
                                        disabled={
                                            +competitions.data?.pagination
                                                .current_page === 1
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
                                            +competitions.data?.pagination
                                                .current_page ===
                                            +competitions.data?.pagination
                                                .last_page
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
                        </>
                    </TabsContent>
                    <TabsContent value="teams">
                        <TeamTable />
                    </TabsContent>
                </Tabs>
            </div>
            {openDeleteModal && (
                <DeleteCompetitionModal
                    competitionId={competitionId}
                    open={openDeleteModal}
                    onOpenChange={setOpenDeleteModal}
                    refetch={competitions.refetch}
                />
            )}
        </MahasiswaLayout>
    );
}
