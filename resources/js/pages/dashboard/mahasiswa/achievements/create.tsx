import DosenLayout from "@/components/layouts/mahasiswaLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import CustomInput from "@/components/ui/shared/customInput";
import { useForm } from "@inertiajs/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    User as UserIcon,
    Trophy,
    Calendar,
    User,
    UserCheck,
    Users,
    ArrowLeft
} from "lucide-react";
import { User as IUser } from "@/types";
import { Competition } from "@/pages/dashboard/admin/competitions/competition-table/columns";
import { toast } from "react-hot-toast";
import { Inertia } from "@inertiajs/inertia";

type Props = {
    userCompetitions: {
        id: number;
        name: string;
        competition: Competition;
        competitionMembers: {
            user: IUser;
        }[];
        dosen: IUser;
        registrant: IUser;
    }[];
    // ...props lain jika ada
};

type FormData = {
    competition_id: number | null;
    achievement: {
        name: string;
        champion: 1 | 2 | 3 | 4 | 5;
        score: number;
    };
    certificates: {
        user_id: number;
        file: File | null;
    }[];
};

export default function AddCompetition({ userCompetitions }: Props) {
    const query = useQueryClient();
    const { user } = useAuth();

    const { data, setData, errors, processing } = useForm<FormData>({
        competition_id: null,
        achievement: {
            name: "",
            champion: 5,
            score: 0
        },
        certificates: [
            {
                user_id: user?.id ?? 0,
                file: null
            }
        ]
    });

    const [selectedCompetition, setSelectedCompetition] = useState<any>(null);

    // Cek apakah achievement sudah ada untuk tim
    const achievementExists = !!selectedCompetition?.achievement;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCompetition) {
            toast.error("Pilih tim/lomba terlebih dahulu.");
            return;
        }
        const formData = new FormData();
        formData.append("team_id", selectedCompetition.id);
        if (!achievementExists) {
            formData.append("name", data.achievement.name);
            formData.append("score", String(data.achievement.score));
            formData.append("champion", String(data.achievement.champion));
        }
        // Hanya upload sertifikat user login jika achievement sudah ada
        const certs = achievementExists
            ? data.certificates.filter((c) => c.user_id === user?.id)
            : data.certificates;
        certs.forEach((cert, idx) => {
            formData.append(
                `certificates[${idx}][user_id]`,
                String(cert.user_id)
            );
            if (cert.file) {
                formData.append(`certificates[${idx}][file]`, cert.file);
            }
        });
        Inertia.post(route("mahasiswa.achievements.create.post"), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success("Prestasi berhasil disimpan!");
                query.invalidateQueries({ queryKey: ["competitions"] });
            }
        });
    };

    // Tambahkan useEffect untuk notifikasi error
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            toast.error("Gagal menyimpan prestasi. Silakan cek data Anda.");
            Object.values(errors).forEach((err) => {
                toast.error(err as string);
            });
        }
    }, [errors]);

    // Ganti allMembers agar langsung ambil dari members
    const allMembers = selectedCompetition?.members ?? [];

    return (
        <DosenLayout title="Laporan Prestasi Lomba">
            <div className="container mx-auto py-4">
                <div className="mb-6">
                    <Button
                        onClick={() => window.history.back()}
                        variant="ghost"
                        className="pl-0 flex items-center gap-2 mb-4"
                    >
                        <ArrowLeft size={16} />
                        <span>Kembali</span>
                    </Button>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Pilih Lomba/Tim */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pilih Lomba/Tim yang Diikuti</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label>Lomba/Tim</Label>
                            <Select
                                value={data.competition_id?.toString()}
                                onValueChange={(value) => {
                                    const competition = userCompetitions.find(
                                        (c) => c.id.toString() === value
                                    );
                                    setSelectedCompetition(competition || null);
                                    if (competition) {
                                        setData({
                                            ...data,
                                            competition_id: competition.id
                                        });
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih lomba/tim yang sudah diikuti" />
                                </SelectTrigger>
                                <SelectContent>
                                    {userCompetitions.map((competition) => (
                                        <SelectItem
                                            key={competition.id}
                                            value={competition.id.toString()}
                                        >
                                            {competition.competition.name} -{" "}
                                            {competition.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Tampilkan detail lomba & tim secara readonly jika sudah dipilih */}
                    {selectedCompetition && (
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
                                                    selectedCompetition
                                                        .competition?.image ||
                                                    "/placeholder.svg"
                                                }
                                                alt={
                                                    selectedCompetition
                                                        .competition?.name
                                                }
                                                className="object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 space-y-4">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">
                                                {
                                                    selectedCompetition
                                                        .competition?.name
                                                }
                                            </h2>
                                            <div className="flex items-center gap-3 mb-3">
                                                <Badge className="bg-purple-100 text-purple-800">
                                                    Level{" "}
                                                    {
                                                        selectedCompetition
                                                            .competition?.level
                                                    }
                                                </Badge>
                                                <Badge className="bg-green-100 text-green-800">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(
                                                        selectedCompetition.competition?.start_date
                                                    ).toLocaleDateString()}{" "}
                                                    -{" "}
                                                    {new Date(
                                                        selectedCompetition.competition?.end_date
                                                    ).toLocaleDateString()}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                                <User className="h-4 w-4" />
                                                <span>
                                                    Penyelenggara:{" "}
                                                    {
                                                        selectedCompetition
                                                            .competition?.author
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-2">
                                                Deskripsi
                                            </h3>
                                            <p className="text-muted-foreground leading-relaxed line-clamp-6">
                                                {
                                                    selectedCompetition
                                                        .competition
                                                        ?.description
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {selectedCompetition && (
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
                                            {selectedCompetition.name}
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
                                                    {
                                                        selectedCompetition
                                                            .dosen?.name
                                                    }
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        selectedCompetition
                                                            .dosen?.identifier
                                                    }{" "}
                                                    •{" "}
                                                    {
                                                        selectedCompetition
                                                            .dosen?.email
                                                    }
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
                                                {
                                                    selectedCompetition
                                                        .registrant?.name
                                                }
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    selectedCompetition
                                                        .registrant?.identifier
                                                }{" "}
                                                •{" "}
                                                {
                                                    selectedCompetition
                                                        .registrant?.email
                                                }
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
                                        Anggota Tim ({allMembers.length})
                                    </Label>
                                    {allMembers.length > 0 && (
                                        <div className="space-y-2">
                                            {allMembers.map((member: any) => (
                                                <div
                                                    key={member.id}
                                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {member.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {member.identifier}{" "}
                                                            • {member.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Form pengisian prestasi */}
                    {selectedCompetition && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Tambah Prestasi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="w-full flex flex-col md:flex-row gap-5">
                                    <CustomInput
                                        label="Nama Prestasi"
                                        placeholder="Juara 1 KMIPN"
                                        onChange={(e) =>
                                            setData(
                                                "achievement.name",
                                                e.target.value
                                            )
                                        }
                                        value={data.achievement.name}
                                        error={errors["achievement.name"]}
                                        required={!achievementExists}
                                        type="text"
                                        disabled={achievementExists}
                                    />
                                    <div className="w-full">
                                        <Label className="uppercase text-purple-900">
                                            Peringkat
                                        </Label>
                                        <Select
                                            onValueChange={(value) =>
                                                setData(
                                                    "achievement.champion",
                                                    Number(value) as
                                                        | 1
                                                        | 2
                                                        | 3
                                                        | 4
                                                        | 5
                                                )
                                            }
                                            value={
                                                data.achievement.champion.toString() ||
                                                ""
                                            }
                                            disabled={achievementExists}
                                        >
                                            <SelectTrigger className="w-full mt-2">
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
                                </div>
                                <div className="w-full flex flex-col md:flex-row gap-5 mt-4">
                                    <CustomInput
                                        label="Skor (Skala 100, Jika Koma dibulatkan)"
                                        placeholder="Masukkan skor"
                                        onChange={(e) =>
                                            setData(
                                                "achievement.score",
                                                Number(e.target.value)
                                            )
                                        }
                                        value={data.achievement.score.toString()}
                                        error={errors["achievement.score"]}
                                        required={!achievementExists}
                                        type="number"
                                        disabled={achievementExists}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Upload Sertifikat */}
                    {selectedCompetition && (
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
                                    {[
                                        ...(selectedCompetition.competitionMembers ??
                                            []),
                                        {
                                            user: {
                                                id: user?.id ?? 0,
                                                name: user?.name ?? "Anda"
                                            }
                                        }
                                    ].map((member: any) => {
                                        const uploaded = data.certificates.find(
                                            (c) => c.user_id === member.user.id
                                        )?.file;

                                        return (
                                            <div key={member.user.id}>
                                                <Label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Sertifikat untuk{" "}
                                                    {member.user.name}
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
                                                                        member
                                                                            .user
                                                                            .id
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
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tombol Simpan */}
                    {selectedCompetition && (
                        <div className="w-full flex justify-end">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {processing ? "Loading..." : "Simpan"}
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </DosenLayout>
    );
}
