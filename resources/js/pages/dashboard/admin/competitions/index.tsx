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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamTable from "./team-table";

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
        <AdminLayout>
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
                        <Link href={route("admin.competitions.create")}>
                            Tambah Lomba
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Kompetisi
                            </CardTitle>
                            <Award className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{total}</div>
                            <p className="text-xs text-muted-foreground">
                                Kompetisi terdaftar dalam sistem
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sedang Berlangsung
                            </CardTitle>
                            <Clock className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ongoing}</div>
                            <p className="text-xs text-muted-foreground">
                                Kompetisi yang sedang aktif
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Selesai
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {completed}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Kompetisi yang telah selesai
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
                            <div className="text-2xl font-bold">{pending}</div>
                            <p className="text-xs text-muted-foreground">
                                Kompetisi yang perlu diverifikasi
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <Tabs defaultValue="competitions" className="mt-6">
                    <TabsList className="grid grid-cols-2 w-fit">
                        <TabsTrigger value="competitions">
                            Kompetisi
                        </TabsTrigger>
                        <TabsTrigger value="teams">Tim</TabsTrigger>
                    </TabsList>
                    <TabsContent value="competitions">
                        <div className="mt-6 p-1 rounded bg-muted inline-flex gap-2">
                            <Button
                                onClick={() =>
                                    setFilter(CompetitionFilterTable.ALL)
                                }
                                size="sm"
                                className={cn("rounded", {
                                    "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                        competitionStatus ===
                                        CompetitionFilterTable.ALL,
                                    "bg-muted text-black/50 hover:bg-muted":
                                        competitionStatus !==
                                        CompetitionFilterTable.ALL
                                })}
                            >
                                Semua
                            </Button>
                            <Button
                                onClick={() =>
                                    setFilter(CompetitionFilterTable.ONGOING)
                                }
                                size="sm"
                                className={cn("rounded", {
                                    "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                        competitionStatus ===
                                        CompetitionFilterTable.ONGOING,
                                    "bg-muted text-black/50 hover:bg-muted":
                                        competitionStatus !==
                                        CompetitionFilterTable.ONGOING
                                })}
                            >
                                Sedang Berlangsung
                            </Button>
                            <Button
                                onClick={() =>
                                    setFilter(CompetitionFilterTable.COMPLETED)
                                }
                                size="sm"
                                className={cn("rounded", {
                                    "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                        competitionStatus ===
                                        CompetitionFilterTable.COMPLETED,
                                    "bg-muted text-black/50 hover:bg-muted":
                                        competitionStatus !==
                                        CompetitionFilterTable.COMPLETED
                                })}
                            >
                                Selesai
                            </Button>
                            <Button
                                onClick={() =>
                                    setFilter(CompetitionFilterTable.PENDING)
                                }
                                size="sm"
                                className={cn("rounded", {
                                    "bg-white rounded text-black font-medium hover:text-black hover:bg-white":
                                        competitionStatus ===
                                        CompetitionFilterTable.PENDING,
                                    "bg-muted text-black/50 hover:bg-muted":
                                        competitionStatus !==
                                        CompetitionFilterTable.PENDING
                                })}
                            >
                                Menunggu Verifikasi
                            </Button>
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
                                    {competitions.data?.pagination.current_page}{" "}
                                    dari{" "}
                                    {competitions.data?.pagination.last_page} |
                                    Total Data:{" "}
                                    {competitions.data?.pagination.total}{" "}
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
        </AdminLayout>
    );
}
