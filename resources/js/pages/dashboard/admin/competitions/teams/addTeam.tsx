import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Plus,
    Trophy,
    User,
    UserCheck,
    Users,
    X,
    Calendar,
    Calculator
} from "lucide-react";
import { Competition } from "../competition-table/columns";
import { Badge } from "@/components/ui/badge";
import { User as IUser } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from "react-select";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import CustomInput from "@/components/ui/shared/customInput";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/layouts/adminLayout";

type Props = {
    competition: Competition;
    dosen: Array<
        IUser & {
            score: number;
            skills: number;
            wins: number;
            competitions: number;
        }
    >;
    mahasiswa: IUser[];
    category: {
        id: number;
        name: string;
    };
    skills: {
        id: number;
        name: string;
    }[];
    _teamMembers?: IUser[];
};

type FormData = {
    competition_id: number;
    name: string;
    dosen_id: number;
    competition_members: {
        user_id: number;
    }[];
    registrant_id: number;
};

type DosenOption = {
    value: number;
    label: string;

    email: string;
    identifier: string;
};

type TeamMember = IUser;

function getRekomendasiLabel(score: number) {
    if (score >= 80) return "Sangat Direkomendasikan";
    if (score >= 60) return "Direkomendasikan";
    if (score >= 40) return "Cukup";
    return "Kurang";
}

export default function JoinCompetition({
    competition,
    dosen,
    mahasiswa,
    category,
    skills,
    _teamMembers = []
}: Props) {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        registrant_id: 0,
        competition_id: competition.id,
        name: "",
        dosen_id: 0,
        competition_members: []
    });

    const [registrant, setRegistrant] = useState<Partial<IUser> | null>(null);

    const [teamMembers, setTeamMembers] =
        useState<Partial<TeamMember>[]>(_teamMembers);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers =
        searchQuery.length > 0
            ? mahasiswa.filter(
                  (user) =>
                      user.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                      user.email
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                      (user.identifier && user.identifier.includes(searchQuery))
              )
            : [];

    const addTeamMember = (user: IUser) => {
        if (!teamMembers.some((member) => member.id === user.id)) {
            const newMember: Partial<TeamMember> = {
                id: user.id,
                name: user.name,
                email: user.email,
                identifier: user.identifier || ""
            };
            setTeamMembers([...teamMembers, newMember]);
            setData("competition_members", [
                ...data.competition_members,
                { user_id: user.id }
            ]);
        }
        setSearchQuery("");
    };

    const removeTeamMember = (userId: number) => {
        setTeamMembers(teamMembers.filter((member) => member.id !== userId));
        setData(
            "competition_members",
            data.competition_members.filter(
                (member) => member.user_id !== userId
            )
        );
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (processing) return;

        post(route("admin.competitions.addTeam.post", competition.id), {
            onSuccess: (data) => {
                toast.success(
                    data.props.success || "Pendaftaran tim berhasil!"
                );
            },
            onError: (error) => {
                Object.keys(error).forEach((key) => {
                    toast.error(error[key]);
                });
            }
        });
    };

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
                            <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">
                                Daftar Kompetisi
                            </h1>
                            <p className="text-muted-foreground">
                                Lengkapi informasi tim untuk mendaftar kompetisi
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
                            <CardTitle>Formulir Pendaftaran Tim</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <CustomInput
                                            label="Nama Tim *"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            error={errors.name}
                                            placeholder="Masukkan nama tim"
                                            type="text"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="dosen">
                                            Dosen Pembimbing *
                                        </Label>
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        (window.location.href =
                                                            route(
                                                                "admin.competitions.topsis",
                                                                {
                                                                    id: competition.id
                                                                }
                                                            ))
                                                    }
                                                    className="flex items-center gap-2"
                                                >
                                                    <Calculator className="h-4 w-4" />
                                                    Detail SPK
                                                </Button>
                                            </div>
                                            <Select<DosenOption>
                                                id="dosen"
                                                value={
                                                    dosen
                                                        .filter(
                                                            (d) =>
                                                                d.id ===
                                                                data.dosen_id
                                                        )
                                                        .map((d) => ({
                                                            value: d.id,
                                                            label: `${d.name} (${Math.round(d.score)} - ${getRekomendasiLabel(d.score)})`,
                                                            email: d.email,
                                                            identifier:
                                                                d.identifier ||
                                                                ""
                                                        }))[0]
                                                }
                                                onChange={(selectedOption) => {
                                                    setData(
                                                        "dosen_id",
                                                        selectedOption
                                                            ? selectedOption.value
                                                            : 0
                                                    );
                                                }}
                                                options={dosen.map((d) => ({
                                                    value: d.id,
                                                    label: `${d.name} (${Math.round(d.score)} - ${getRekomendasiLabel(d.score)})`,
                                                    email: d.email,
                                                    identifier:
                                                        d.identifier || ""
                                                }))}
                                                placeholder="Pilih dosen pembimbing"
                                                isSearchable
                                                isClearable
                                                formatOptionLabel={(option) => (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {option.label}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {option.email}
                                                        </span>
                                                    </div>
                                                )}
                                                filterOption={(
                                                    option,
                                                    inputValue
                                                ) => {
                                                    const searchValue =
                                                        inputValue.toLowerCase();
                                                    return (
                                                        option.label
                                                            .toLowerCase()
                                                            .includes(
                                                                searchValue
                                                            ) ||
                                                        option.data.email
                                                            .toLowerCase()
                                                            .includes(
                                                                searchValue
                                                            ) ||
                                                        option.data.identifier
                                                            .toLowerCase()
                                                            .includes(
                                                                searchValue
                                                            )
                                                    );
                                                }}
                                                noOptionsMessage={() =>
                                                    "Tidak ada dosen ditemukan"
                                                }
                                            />
                                            <p className="mt-1 text-sm text-gray-500">
                                                Dosen diurutkan berdasarkan
                                                rekomendasi sistem menggunakan
                                                metode TOPSIS
                                            </p>
                                            {errors.dosen_id && (
                                                <small className="text-red-600 text-xs">
                                                    * {errors.dosen_id}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Team Leader */}
                                <div className="mt-2">
                                    <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                                        <UserCheck className="h-4 w-4" />
                                        Ketua Tim
                                    </Label>
                                    {registrant ? (
                                        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border">
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {registrant?.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {registrant?.identifier} •{" "}
                                                    {registrant?.email}
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="bg-purple-100 text-purple-800 border-purple-300"
                                            >
                                                Ketua
                                            </Badge>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
                                            <div className="flex-1">
                                                <p className="text-sm text-muted-foreground">
                                                    Belum ada ketua tim yang
                                                    ditentukan
                                                </p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className="bg-gray-100 text-gray-800 border-gray-300"
                                            >
                                                Belum Ditentukan
                                            </Badge>
                                        </div>
                                    )}
                                </div>

                                {/* Team Members */}
                                <div className="mt-4">
                                    <Label className="text-sm font-medium flex items-center gap-2 mb-1">
                                        <Users className="h-4 w-4" />
                                        Anggota Tim ({teamMembers.length})
                                    </Label>

                                    {/* Search and Add Members */}
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="search-members">
                                                Cari dan Tambah Anggota
                                            </Label>
                                            <Input
                                                id="search-members"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Cari berdasarkan nama, NIM, atau email..."
                                            />

                                            {searchQuery && (
                                                <div className="border rounded-lg max-h-48 overflow-y-auto">
                                                    {filteredUsers.length >
                                                    0 ? (
                                                        filteredUsers.map(
                                                            (user) => (
                                                                <div
                                                                    key={
                                                                        user.id
                                                                    }
                                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                                                    onClick={() =>
                                                                        addTeamMember(
                                                                            user
                                                                        )
                                                                    }
                                                                >
                                                                    <div className="flex-1">
                                                                        <p className="font-medium">
                                                                            {
                                                                                user.name
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-muted-foreground">
                                                                            {
                                                                                user.identifier
                                                                            }{" "}
                                                                            •{" "}
                                                                            {
                                                                                user.email
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <Plus className="h-5 w-5 text-purple-600" />
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="p-4 text-center text-sm text-muted-foreground">
                                                            Tidak ada pengguna
                                                            ditemukan
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Current Team Members */}
                                        {teamMembers.length > 0 && (
                                            <div className="space-y-3">
                                                <Label>
                                                    Anggota Tim Saat Ini
                                                </Label>
                                                <div className="space-y-2">
                                                    {teamMembers.map(
                                                        (member) => (
                                                            <div
                                                                key={member.id}
                                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                                            >
                                                                <div className="flex-1">
                                                                    <p className="font-medium">
                                                                        {
                                                                            member.name
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        {
                                                                            member.identifier
                                                                        }{" "}
                                                                        •{" "}
                                                                        {
                                                                            member.email
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    {!registrant && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                setRegistrant(
                                                                                    member
                                                                                );
                                                                                setData(
                                                                                    "registrant_id",
                                                                                    member.id ??
                                                                                        0
                                                                                );
                                                                                removeTeamMember(
                                                                                    member.id ??
                                                                                        0
                                                                                );
                                                                            }}
                                                                        >
                                                                            Jadikan
                                                                            Ketua
                                                                        </Button>
                                                                    )}
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            removeTeamMember(
                                                                                member.id ??
                                                                                    0
                                                                            )
                                                                        }
                                                                        className="p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full inline-flex justify-end mt-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? "Mengirim..."
                                            : "Daftar Tim"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
