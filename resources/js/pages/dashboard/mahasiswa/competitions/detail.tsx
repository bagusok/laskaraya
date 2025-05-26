import MahasiswaLayout from "@/components/layouts/mahasiswaLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, User, Calendar, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User as IUser } from "@/types";
import { Competition } from "@/pages/dashboard/admin/competitions/competition-table/columns";

import { cn } from "@/lib/utils";
import useAuth from "@/hooks/use-auth";
import { Link } from "@inertiajs/react";

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

export default function TeamDetail({
    competition,
    category,
    skills,
    isJoined,
    joinedTeamId
}: Props) {
    const { user } = useAuth();

    return (
        <MahasiswaLayout>
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
                    {/* status Kompetisi */}
                    {competition.uploader_id == user!.id && (
                        <Card
                            className={cn({
                                "bg-yellow-50 border-yellow-200":
                                    competition.verified_status === "pending",
                                "bg-red-50 border-red-200":
                                    competition.verified_status === "rejected",
                                "bg-green-50 border-green-200":
                                    competition.verified_status === "accepted"
                            })}
                        >
                            <CardHeader>
                                <CardTitle className="text-yellow-800">
                                    Status Verifikasi:{" "}
                                    <span className="font-semibold">
                                        {competition.verified_status ===
                                        "pending"
                                            ? "Menunggu Verifikasi"
                                            : competition.verified_status ===
                                                "rejected"
                                              ? "Ditolak"
                                              : "Diterima"}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {competition.verified_status === "pending" && (
                                    <p className="text-yellow-700">
                                        Kompetisi yang anda ajukan sedang
                                        menunggu verifikasi. Silakan tunggu
                                        konfirmasi dari admin.
                                    </p>
                                )}
                                {competition.verified_status === "rejected" && (
                                    <p className="text-red-700">
                                        Kompetisi yang anda ajukan ditolak.
                                        Silakan periksa kembali data yang anda
                                        masukkan atau hubungi admin untuk
                                        informasi lebih lanjut.
                                    </p>
                                )}

                                {competition.verified_status === "accepted" && (
                                    <p className="text-green-700">
                                        Kompetisi yang anda ajukan telah
                                        diterima. Anda dapat melihat detail
                                        kompetisi di bawah ini.
                                    </p>
                                )}
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

                    {isJoined && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center">
                                <span className="font-semibold text-lg">
                                    Kamu sudah bergabung di kompetisi ini
                                </span>
                                <Button className="mt-4" asChild>
                                    <Link
                                        href={route(
                                            "mahasiswa.teams.detail",
                                            joinedTeamId
                                        )}
                                    >
                                        Gabung Sekarang
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {!isJoined && competition.status == "ongoing" && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center">
                                <span className="font-semibold text-lg">
                                    Kamu belum bergabung di kompetisi ini
                                </span>
                                <Button className="mt-4" asChild>
                                    <Link
                                        href={route(
                                            "mahasiswa.competitions.join",
                                            competition.id
                                        )}
                                    >
                                        Gabung Sekarang
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </MahasiswaLayout>
    );
}
