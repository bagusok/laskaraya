import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, User, Calendar, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User as IUser } from "@/types";
import { Competition } from "@/pages/dashboard/admin/competitions/competition-table/columns";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import axios from "axios";
import { teamColumns } from "./team-table/columns";
import DataTable from "@/components/ui/shared/dataTable";
import AdminLayout from "@/components/layouts/adminLayout";
import DeleteTeamModal from "./team-table/deleteTeam";

type Props = {
    competition: Competition;
    category: {
        id: number;
        name: string;
    };
    skills: {
        id: number;
        name: string;
    }[];
    dosen: IUser;
    mahasiswa: IUser[];
    members: IUser[];
    registrant: IUser;
    achievement?: Achievement;
    isJoined: boolean;
    joinedTeamId?: number;
};

export type Achievement = {
    id: number;
    user_to_competition_id: number;
    name: string;
    description?: string;
    champion: 1 | 2 | 3 | 4 | 5;
    score: number;
    certificates: {
        id: number;
        user_id: number;
        file_url: string;
        user: IUser;
    }[];
};

export default function TeamDetail({ competition, category, skills }: Props) {
    const [processing, setProcessing] = useState(false);
    const [reason, setReason] = useState<string | null>(null);

    const query = useQueryClient();

    const handleVerify = async (status: "accepted" | "rejected") => {
        if (status === "rejected" && !reason) {
            toast.error("Alasan penolakan harus diisi");
            return;
        }

        router.post(
            route("admin.competitions.response", competition.id),
            {
                verified_status: status,
                reason: status === "rejected" ? reason : null
            },
            {
                onStart: () => {
                    setProcessing(true);
                },
                onFinish: () => {
                    setProcessing(false);
                },
                onSuccess: (data) => {
                    query.invalidateQueries({
                        queryKey: ["competitions"],
                        exact: false
                    });
                    toast.success(data.props.success);
                },
                onError: (errors) => {
                    Object.keys(errors).forEach((key) =>
                        toast.error(errors[key])
                    );
                }
            }
        );
    };

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [teamId, setTeamId] = useState(0);
    const [page, setPage] = useState(1);
    const teams = useQuery({
        queryKey: ["teams", competition.id, page],
        queryFn: async () => {
            const res = await axios.get(route("admin.teams.getAll"), {
                params: {
                    page,
                    limit: 10,
                    competition_id: competition.id
                }
            });
            return res.data;
        }
    });

    const columns = useCallback(() => {
        return teamColumns(setOpenDeleteModal, setTeamId, 0);
    }, []);

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
                        <span>Kembali </span>
                    </Button>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Medal className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Detail Kompetisi
                            </h1>
                            <p className="text-muted-foreground"></p>
                        </div>
                    </div>
                </div>
                <div className="w-full grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-purple-600" />
                                Informasi Kompetisi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="md:col-span-1">
                                    <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-100">
                                        <img
                                            src={
                                                competition.image ||
                                                "/placeholder.svg"
                                            }
                                            alt={competition.name}
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2">
                                            {competition.name}
                                        </h2>
                                        <div className="flex items-center gap-3 mb-3">
                                            <Badge className="bg-purple-100 text-purple-800">
                                                Level {competition.level}
                                            </Badge>
                                            <Badge className="bg-blue-100 text-blue-800">
                                                {category.name}
                                            </Badge>
                                            <Badge
                                                className={cn({
                                                    "bg-yellow-100 text-yellow-800 font-semibold":
                                                        competition.status ==
                                                        "ongoing",
                                                    "bg-green-100 text-green-800 font-semibold":
                                                        competition.status ==
                                                        "completed",
                                                    "bg-red-100 text-red-800 font-semibold":
                                                        competition.status ==
                                                        "canceled"
                                                })}
                                            >
                                                {competition.status}
                                            </Badge>
                                            <Badge className="bg-green-100 text-green-800">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {new Date(
                                                    competition.start_date
                                                ).toLocaleDateString()}{" "}
                                                -{" "}
                                                {new Date(
                                                    competition.end_date
                                                ).toLocaleDateString()}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <User className="h-4 w-4" />
                                            <span>
                                                Penyelenggara:{" "}
                                                {competition.author}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 flex-wrap">
                                        {skills?.map((skill) => (
                                            <Badge
                                                key={skill.id}
                                                className="bg-purple-100 text-purple-800 mr-2 mb-2"
                                            >
                                                {skill.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                Deskripsi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <p className="text-muted-foreground leading-relaxed line-clamp-6">
                                    {competition.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {competition.verified_status != "pending" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Verifikasi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <span>
                                    Status:{" "}
                                    <Badge
                                        className={cn({
                                            "bg-green-100 text-green-800":
                                                competition.verified_status ==
                                                "accepted",
                                            "bg-red-100 text-red-800":
                                                competition.verified_status ==
                                                "rejected"
                                        })}
                                    >
                                        {competition.verified_status}
                                    </Badge>
                                </span>
                            </CardContent>
                        </Card>
                    )}
                    {competition.verified_status == "pending" &&
                        !processing && (
                            <Card>
                                <CardContent className="flex flex-col gap-4 justify-center items-center">
                                    <p className="text-lg font-semibold">
                                        Verifikasi Lomba Ini
                                    </p>
                                    <div className="inline-flex gap-2">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive">
                                                    Setujui
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Apa kamu yakin untuk
                                                        menyetujui kompetisi
                                                        ini?
                                                    </AlertDialogTitle>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleVerify(
                                                                "accepted"
                                                            )
                                                        }
                                                    >
                                                        Ya
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button>Tolak Kompetisi</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Apa kamu yakin untuk
                                                        menolak kompetisi ini?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription
                                                        asChild
                                                    >
                                                        <div>
                                                            <Label>
                                                                Alasan
                                                            </Label>
                                                            <textarea
                                                                value={
                                                                    reason || ""
                                                                }
                                                                onChange={(e) =>
                                                                    setReason(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-full mt-2 p-2 border rounded-md"
                                                                rows={4}
                                                                placeholder="Masukkan alasan penolakan"
                                                            ></textarea>
                                                        </div>
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Batal
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleVerify(
                                                                "rejected"
                                                            )
                                                        }
                                                    >
                                                        Ya
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    {processing && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center">
                                <p className="text-lg font-semibold">
                                    Memproses verifikasi...
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="overflow-hidden">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Daftar Tim Peserta yang Mendaftar di Lomba
                                    Ini
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    {teams.isSuccess && (
                                        <DataTable
                                            columns={columns()}
                                            data={teams.data.data}
                                        />
                                    )}

                                    {teams.isLoading && (
                                        <div className="flex items-center justify-center w-full h-96">
                                            <p className="text-muted-foreground">
                                                Loading...
                                            </p>
                                        </div>
                                    )}
                                    {teams.isError && (
                                        <div className="flex items-center justify-center w-full h-96">
                                            <p className="text-muted-foreground">
                                                Terjadi kesalahan saat memuat
                                                data kompetisi
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full inline-flex justify-between items-center mt-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Halaman{" "}
                                            {
                                                teams.data?.pagination
                                                    .current_page
                                            }{" "}
                                            dari{" "}
                                            {teams.data?.pagination.last_page} |
                                            Total Data:{" "}
                                            {teams.data?.pagination.total}{" "}
                                        </p>
                                    </div>

                                    <div className="inline-flex gap-2">
                                        <Button
                                            disabled={
                                                +teams.data?.pagination
                                                    .current_page === 1
                                            }
                                            onClick={() => {
                                                setPage(
                                                    +teams.data?.pagination
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
                                                +teams.data?.pagination
                                                    .current_page ===
                                                +teams.data?.pagination
                                                    .last_page
                                            }
                                            onClick={() => {
                                                setPage(
                                                    +teams.data?.pagination
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
                            </CardContent>
                        </Card>
                        {openDeleteModal && (
                            <DeleteTeamModal
                                teamId={teamId}
                                open={openDeleteModal}
                                onOpenChange={setOpenDeleteModal}
                                refetch={() => {
                                    teams.refetch();
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
