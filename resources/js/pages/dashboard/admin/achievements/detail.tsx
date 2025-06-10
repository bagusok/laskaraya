import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { router } from "@inertiajs/react";
import {
    ArrowLeft,
    Trophy,
    User,
    UserCheck,
    Users,
    Calendar,
    Medal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User as IUser } from "@/types";
import { Label } from "@/components/ui/label";
import CustomInput from "@/components/ui/shared/customInput";
import { Competition } from "@/pages/dashboard/admin/competitions/competition-table/columns";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useState } from "react";
import { Team } from "@/pages/dashboard/mahasiswa/competitions/team-table/columns";
import toast from "react-hot-toast";
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
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/layouts/adminLayout";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
    competition: Competition;
    dosen: IUser;
    mahasiswa: IUser[];
    team: Team;
    members: IUser[];
    registrant: IUser;
    achievement?: Achievement;
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

export default function TeamDetail({
    competition,
    dosen,
    team,
    members,
    registrant,
    achievement
}: Props) {
    const [reason, setReason] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const query = useQueryClient();

    const handleVerify = async (status: "accepted" | "rejected") => {
        if (!achievement) {
            toast.error("Prestasi belum diisi");
            return;
        }

        if (status == "rejected" && !reason) {
            toast.error("Alasan penolakan harus diisi");
            return;
        }

        router.post(
            route("admin.achievements.response", achievement?.id ?? 0),
            {
                status: status,
                reason: status == "rejected" ? reason : null
            },
            {
                onSuccess: (data) => {
                    toast.success(data.props.success);
                    query.invalidateQueries({
                        queryKey: ["teams"],
                        exact: false
                    });
                },
                onError: (errors) => {
                    Object.keys(errors).forEach((key) =>
                        toast.error(errors[key])
                    );
                },
                onStart: () => {
                    setProcessing(true);
                },
                onFinish: () => {
                    setProcessing(false);
                    setReason("");
                }
            }
        );
    };

    // Cek status pending
    const isPending =
        team.status === "pending" && competition.verified_status === "pending";

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
                                Team {team.name} - {competition.name}
                            </h1>
                            <p className="text-muted-foreground"></p>
                        </div>
                    </div>
                </div>
                <div className="w-full grid gap-8">
                    {isPending && !processing && (
                        <Card>
                            <CardContent className="flex flex-col gap-4 justify-center items-center">
                                <p className="text-lg font-semibold">
                                    Verifikasi Prestasi ini?
                                </p>
                                <div className="inline-flex gap-2">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="default"
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                Terima
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Apa kamu yakin untuk
                                                    menerima prestasi ini?
                                                </AlertDialogTitle>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Batal
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleVerify("accepted")
                                                    }
                                                >
                                                    Ya
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive">
                                                Tolak
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Apa kamu yakin untuk menolak
                                                    prestasi ini?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    <div className="mt-4">
                                                        <Label>
                                                            Alasan Penolakan
                                                        </Label>
                                                        <textarea
                                                            className="w-full mt-2 p-2 border rounded-md"
                                                            value={reason || ""}
                                                            onChange={(e) =>
                                                                setReason(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            placeholder="Masukkan alasan penolakan..."
                                                        />
                                                    </div>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>
                                                    Batal
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() =>
                                                        handleVerify("rejected")
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

                    {!isPending && (
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
                                                team.status == "accepted",
                                            "bg-red-100 text-red-800":
                                                team.status == "rejected"
                                        })}
                                    >
                                        {team.status}
                                    </Badge>
                                </span>
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
                                    <div>
                                        <h3 className="font-medium mb-2">
                                            Deskripsi
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed line-clamp-6">
                                            {competition.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Tim</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label className="text-primary">
                                        Nama Tim
                                    </Label>
                                    <p className="text-base font-semibold">
                                        {team.name}
                                    </p>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                                        <User className="h-4 w-4" />
                                        Dosen
                                    </Label>
                                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border">
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {dosen.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {dosen.identifier} •{" "}
                                                {dosen.email}
                                            </p>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className="bg-purple-100 text-purple-800 border-purple-300"
                                        >
                                            Pembimbing
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-2">
                                <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                                    <UserCheck className="h-4 w-4" />
                                    Ketua Tim
                                </Label>
                                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border">
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {registrant.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {registrant.identifier} •{" "}
                                            {registrant.email}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-purple-100 text-purple-800 border-purple-300"
                                    >
                                        Ketua
                                    </Badge>
                                </div>
                            </div>
                            <div className="mt-4">
                                <Label className="text-sm font-medium flex items-center gap-2 mb-1">
                                    <Users className="h-4 w-4" />
                                    Anggota Tim ({members.length})
                                </Label>

                                {members.length > 0 && (
                                    <div className="space-y-2">
                                        {members.map((member) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {member.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {member.identifier} •{" "}
                                                        {member.email}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulir Prestasi */}
                    {team.status == "accepted" && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Prestasi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <CustomInput
                                            label="Nama Prestasi"
                                            placeholder="Belum diisi"
                                            value={achievement?.name || ""}
                                            onChange={() => {}}
                                            required
                                            type="text"
                                            disabled
                                        />
                                        <div>
                                            <Label className="text-purple-900 mb-1">
                                                Peringkat
                                            </Label>
                                            <Select
                                                value={
                                                    achievement?.champion
                                                        ? achievement.champion.toString()
                                                        : ""
                                                }
                                                disabled
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Belum diisi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="1">
                                                        Peringkat 1
                                                    </SelectItem>
                                                    <SelectItem value="2">
                                                        Peringkat 2
                                                    </SelectItem>
                                                    <SelectItem value="3">
                                                        Peringkat 3
                                                    </SelectItem>
                                                    <SelectItem value="4">
                                                        Peringkat 4
                                                    </SelectItem>
                                                    <SelectItem value="5">
                                                        Peringkat 5
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <CustomInput
                                            label="Skor (Skala 100, Jika Koma dibulatkan)"
                                            placeholder="Belum diisi"
                                            onChange={() => {}}
                                            value={
                                                achievement?.score.toString() ||
                                                ""
                                            }
                                            required
                                            type="number"
                                            disabled
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="rounded-2xl shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold">
                                        Sertifikat (Jika Ada)
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        File dapat berupa PDF, JPG, JPEG, atau
                                        PNG.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {members.map((member) => {
                                            const certificate =
                                                achievement?.certificates.find(
                                                    (c) =>
                                                        c.user_id === member.id
                                                );

                                            return (
                                                <div key={member.id}>
                                                    <Label className="mb-2 block text-sm font-medium text-gray-700">
                                                        Sertifikat untuk{" "}
                                                        {member.name}
                                                    </Label>

                                                    <label className="cursor-pointer group flex items-center justify-between gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 hover:border-primary transition overflow-hidden">
                                                        <div className="text-sm text-gray-600 group-hover:text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                                                            {certificate?.file_url
                                                                ? certificate.file_url
                                                                : "Belum ada sertifikat"}
                                                        </div>
                                                    </label>

                                                    {certificate?.file_url && (
                                                        <a
                                                            className="mt-2 text-blue-400 hover:underline text-xs"
                                                            href={
                                                                certificate.file_url
                                                            }
                                                            target="_blank"
                                                        >
                                                            Lihat Sertifikat
                                                        </a>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
