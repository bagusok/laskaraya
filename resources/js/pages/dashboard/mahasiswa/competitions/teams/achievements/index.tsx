import MahasiswaLayout from "@/components/layouts/mahasiswaLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@inertiajs/react";
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
import { Team } from "../../team-table/columns";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useEffect } from "react";

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

type FormData = {
    name: string;
    team_id: number;
    description?: string;
    champion: 1 | 2 | 3 | 4 | 5;
    score: number;
    certificates: {
        user_id: number;
        file: File | null;
    }[];
};

export default function TeamAchievement({
    competition,
    dosen,
    team,
    members,
    registrant,
    achievement
}: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        name: achievement?.name || "",
        team_id: team.id,
        description: achievement?.description || "",
        champion: achievement?.champion || 5,
        score: achievement?.score || 0,
        certificates: members.map((member) => ({
            user_id: member.id,
            file: null
        }))
    });

    const urlToFile = async (
        url: string,
        filename: string,
        mimeType: string
    ): Promise<File> => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], filename, { type: mimeType });
    };

    const getFileCertificates = async () => {
        if (achievement?.certificates) {
            const updatedCertificates = await Promise.all(
                achievement.certificates.map(async (cert) => ({
                    user_id: cert.user_id,
                    file: cert.file_url
                        ? await urlToFile(
                              cert.file_url,
                              cert.file_url.split("/").pop() ||
                                  "certificate.pdf",
                              "application/pdf"
                          )
                        : null
                }))
            );
            setData("certificates", updatedCertificates);
        }
    };

    useEffect(() => {
        if (achievement?.certificates && achievement.certificates.length > 0) {
            getFileCertificates();
        } else {
            setData(
                "certificates",
                members.map((member) => ({
                    user_id: member.id,
                    file: null
                }))
            );
        }
    }, [achievement?.certificates]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("mahasiswa.teams.achievement.create.post"), {
            onSuccess: (data) => toast.success(data.props.success),
            onError: (error) => {
                if (error) {
                    Object.entries(error).forEach(([key, value]) => {
                        toast.error(`${key}: ${value}`);
                    });
                } else {
                    toast.error("Terjadi kesalahan, silakan coba lagi.");
                }
            }
        });
    };

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
                                Isi Prestasi
                            </h1>
                            <p className="text-muted-foreground">
                                Lengkapi Prestasi yang telah diraih oleh tim
                                Anda dalam kompetisi ini.
                            </p>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Prestasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <CustomInput
                                    label="Nama Prestasi"
                                    placeholder="Juara 1 KMIPN"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    value={data.name}
                                    error={errors.name}
                                    required
                                    type="text"
                                />
                                <div>
                                    <Label className="text-purple-900 mb-1">
                                        Peringkat
                                    </Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setData(
                                                "champion",
                                                Number(value) as
                                                    | 1
                                                    | 2
                                                    | 3
                                                    | 4
                                                    | 5
                                            )
                                        }
                                        value={data.champion.toString()}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Peringkat" />
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
                                    placeholder="Masukkan skor"
                                    onChange={(e) =>
                                        setData("score", Number(e.target.value))
                                    }
                                    value={data.score.toString()}
                                    error={errors.score}
                                    required
                                    type="number"
                                />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold">
                                Unggah Sertifikat (Jika Ada)
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                File dapat berupa PDF, JPG, JPEG, atau PNG.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {members.map((member) => {
                                    const uploaded = data.certificates.find(
                                        (c) => c.user_id === member.id
                                    )?.file;

                                    const fileUrl =
                                        achievement?.certificates.find(
                                            (cert) => cert.user_id === member.id
                                        );

                                    return (
                                        <div key={member.id}>
                                            <Label className="mb-2 block text-sm font-medium text-gray-700">
                                                Sertifikat untuk {member.name}
                                            </Label>

                                            <label className="cursor-pointer group flex items-center justify-between gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 hover:border-primary transition overflow-hidden">
                                                <div className="text-sm text-gray-600 group-hover:text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {uploaded
                                                        ? uploaded.name
                                                        : "Pilih file sertifikat"}
                                                </div>
                                                <div className="text-primary font-medium text-sm">
                                                    Unggah
                                                </div>
                                                <input
                                                    type="file"
                                                    accept=".pdf,.jpg,.jpeg,.png"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target
                                                                .files?.[0] ||
                                                            null;
                                                        setData(
                                                            "certificates",
                                                            data.certificates.map(
                                                                (cert) =>
                                                                    cert.user_id ===
                                                                    member.id
                                                                        ? {
                                                                              ...cert,
                                                                              file
                                                                          }
                                                                        : cert
                                                            )
                                                        );
                                                    }}
                                                    className="hidden"
                                                />
                                            </label>

                                            {fileUrl?.file_url && (
                                                <a
                                                    className="mt-2 text-blue-400 hover:underline text-xs"
                                                    href={fileUrl.file_url}
                                                    target="_blank"
                                                >
                                                    Lihat Sertifikat
                                                </a>
                                            )}

                                            {errors.certificates &&
                                                errors.certificates[
                                                    member.id
                                                ] && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {
                                                            errors.certificates[
                                                                member.id
                                                            ]
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {processing ? "Menyimpan..." : "Simpan Prestasi"}
                        </Button>
                    </div>
                </div>
            </div>
        </MahasiswaLayout>
    );
}
