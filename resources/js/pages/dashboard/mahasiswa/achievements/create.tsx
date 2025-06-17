import DosenLayout from "@/components/layouts/mahasiswaLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import CustomInput from "@/components/ui/shared/customInput";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { useForm } from "@inertiajs/react";
import { useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import {
    CalendarIcon,
    ChevronLeft,
    ImageIcon,
    Plus,
    Upload,
    UserCheck,
    Users2,
    X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import toast from "react-hot-toast";
import ReactSelect from "react-select";
import { Competition } from "../competitions/competition-table/columns";
import CompetitionDetail from "./competitionDetail";

type Props = {
    categories: {
        id: number;
        name: string;
    }[];
    periods: {
        id: number;
        name: string;
        year: string;
    }[];
    skills: {
        id: number;
        name: string;
    }[];
    dosen: User[];
    mahasiswa: User[];
    competitions: Competition[];
};

type FormData = {
    competition_id: number | null;
    name: string;
    author: string;
    image: File | null;
    category_id: string;
    period_id: string;
    level: string;
    status: string;
    description: string;
    start_date: string;
    end_date: string;
    skills: number[];
    team: {
        name: string;
        dosen_id: number;
        competition_members: {
            user_id: number;
        }[];
    };
    achievement: {
        name: string;
        description?: string;
        champion: 1 | 2 | 3 | 4 | 5;
        score: number;
    };
    certificates: {
        user_id: number;
        file: File | null;
    }[];
};

type TeamMember = User;

type DosenOption = {
    value: number;
    label: string;

    email: string;
    identifier: string;
};

export default function AddCompetition({
    categories,
    periods,
    skills,
    dosen,
    mahasiswa,
    competitions
}: Props) {
    const query = useQueryClient();
    const { user } = useAuth();

    console.log("competitions", competitions);

    const { data, setData, errors, post, processing } = useForm<FormData>({
        competition_id: null,
        name: "",
        author: "",
        image: null,
        category_id: "",
        period_id: "",
        level: "",
        status: "completed",
        description: "",
        start_date: "",
        end_date: "",
        skills: [],
        team: {
            name: "",
            dosen_id: 0,
            competition_members: []
        },
        achievement: {
            name: "",
            description: "",
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

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7)
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);

    const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPosterPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setData("image", file);
        }
    };

    const groupedPeriods = useMemo(() => {
        return periods.reduce<Record<string, typeof periods>>((acc, period) => {
            if (!acc[period.year]) acc[period.year] = [];
            acc[period.year].push(period);
            return acc;
        }, {});
    }, [periods]);

    useEffect(() => {
        if (date?.from && date?.to) {
            setData("start_date", format(date.from, "yyyy-MM-dd"));
            setData("end_date", format(date.to, "yyyy-MM-dd"));
        }
    }, [date]);

    const [teamMembers, setTeamMembers] = useState<Partial<TeamMember>[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = useMemo(() => {
        if (searchQuery.length === 0) return [];
        const query = searchQuery.toLowerCase();
        return mahasiswa.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                (user.identifier && user.identifier.includes(query))
        );
    }, [searchQuery, mahasiswa]);

    const selectedCompetition = useMemo(() => {
        return (
            competitions.find(
                (competition) => competition.id === data.competition_id
            ) ?? null
        );
    }, [data.competition_id, competitions]);

    const addTeamMember = (user: User) => {
        if (!teamMembers.some((member) => member.id === user.id)) {
            const newMember: Partial<TeamMember> = {
                id: user.id,
                name: user.name,
                email: user.email,
                identifier: user.identifier || ""
            };
            setTeamMembers([...teamMembers, newMember]);
            setData("team.competition_members", [
                ...data.team.competition_members,
                { user_id: user.id }
            ]);
            // set certificate for the user
            setData("certificates", [
                ...data.certificates,
                {
                    user_id: user.id,
                    file: null // Initialize with null, will be set later
                }
            ]);
        }
        setSearchQuery("");
    };

    const removeTeamMember = (userId: number) => {
        setTeamMembers(teamMembers.filter((member) => member.id !== userId));
        setData(
            "team.competition_members",
            data.team.competition_members.filter(
                (member) => member.user_id !== userId
            )
        );

        setData(
            "certificates",
            data.certificates.filter((cert) => cert.user_id !== userId)
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.start_date || !data.end_date) {
            toast.error("Silakan pilih tanggal mulai dan akhir.");
            return;
        }

        post(route("mahasiswa.achievements.create.post"), {
            onSuccess: (data) => {
                toast.success(data.props.success);
                query.invalidateQueries({
                    queryKey: ["competitions"]
                });
            },
            onError: (error) => {
                Object.keys(error).forEach((key) => toast.error(error[key]));
            }
        });
    };

    return (
        <DosenLayout title="Tambah Lomba">
            <div className="container mx-auto py-4">
                <div className="inline-flex w-full justify-between items-end">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="bg-white"
                            onClick={() => window.history.back()}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Kembali
                        </Button>
                    </div>
                </div>

                <div className="mt-6">
                    <Label>Pilih Lomba (Jika Sudah Ada)</Label>
                    <Select
                        onValueChange={(value) => {
                            setData(
                                "competition_id",
                                value === "null" ? null : parseInt(value)
                            );
                        }}
                        value={
                            data.competition_id
                                ? data.competition_id.toString()
                                : "null"
                        }
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Pilih Lomba" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="null">
                                Lomba Belum Ada
                            </SelectItem>
                            {competitions.map((competition) => (
                                <SelectItem
                                    value={competition.id.toString()}
                                    key={competition.id}
                                >
                                    {competition.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mt-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {selectedCompetition !== null ? (
                            <CompetitionDetail
                                competition={selectedCompetition}
                            />
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Kompetisi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                                            {posterPreview ? (
                                                <div className="relative w-full max-w-md">
                                                    <div className="aspect-[3/4] relative rounded-md overflow-hidden">
                                                        <img
                                                            src={
                                                                posterPreview ||
                                                                "/placeholder.svg"
                                                            }
                                                            alt="Preview poster"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            setPosterPreview(
                                                                null
                                                            )
                                                        }
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                                    >
                                                        <X size={16} />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="mb-4 p-4 bg-purple-100 rounded-full">
                                                        <ImageIcon className="h-8 w-8 text-purple-600" />
                                                    </div>
                                                    <div className="text-center mb-4">
                                                        <p className="text-sm font-medium">
                                                            Unggah poster
                                                            kompetisi
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            PNG, JPG atau JPEG
                                                            (maks. 2MB)
                                                        </p>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="bg-white"
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        Pilih File
                                                    </Button>
                                                </>
                                            )}

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/png, image/jpeg, image/jpg"
                                                className="hidden"
                                                onChange={handlePosterChange}
                                            />
                                        </div>
                                        <div className="w-full flex flex-col md:flex-row gap-5">
                                            <CustomInput
                                                label="Nama"
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                value={data.name}
                                                type="text"
                                                placeholder="Nama Kompetisi"
                                                error={errors.name}
                                                required
                                            />
                                            <CustomInput
                                                label="PENYELENGGARA"
                                                onChange={(e) =>
                                                    setData(
                                                        "author",
                                                        e.target.value
                                                    )
                                                }
                                                value={data.author}
                                                type="text"
                                                placeholder="Polinema"
                                                error={errors.author}
                                                required
                                            />
                                        </div>
                                        <div className="w-full flex flex-col md:flex-row gap-5">
                                            <div className="w-full">
                                                <Label className="uppercase text-purple-900">
                                                    Kategori
                                                </Label>
                                                <Select
                                                    value={data.category_id}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "category_id",
                                                            value.toString()
                                                        )
                                                    }
                                                    required
                                                >
                                                    <SelectTrigger className="w-full mt-2">
                                                        <SelectValue placeholder="Pilih Kategori" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map(
                                                            (category) => (
                                                                <SelectItem
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    value={category.id.toString()}
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="w-full">
                                                <Label className="uppercase text-purple-900">
                                                    Periode
                                                </Label>
                                                <Select
                                                    value={data.period_id}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "period_id",
                                                            value.toString()
                                                        )
                                                    }
                                                    required
                                                >
                                                    <SelectTrigger className="w-full mt-2">
                                                        <SelectValue placeholder="Pilih Periode" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(
                                                            groupedPeriods
                                                        ).map(
                                                            ([year, items]) => (
                                                                <SelectGroup
                                                                    key={year}
                                                                >
                                                                    <SelectLabel className="text-purple-900 font-semibold">
                                                                        {year}
                                                                    </SelectLabel>
                                                                    {items.map(
                                                                        (
                                                                            period
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    period.id
                                                                                }
                                                                                value={period.id.toString()}
                                                                            >
                                                                                {
                                                                                    period.name
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )}
                                                                </SelectGroup>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="w-full flex flex-col md:flex-row gap-5">
                                            <div className="w-full">
                                                <Label className="uppercase text-purple-900">
                                                    Level
                                                </Label>
                                                <Select
                                                    value={data.level}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "level",
                                                            value.toString()
                                                        )
                                                    }
                                                    required
                                                >
                                                    <SelectTrigger className="w-full mt-2">
                                                        <SelectValue placeholder="Pilih Kategori" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">
                                                            Internasional
                                                        </SelectItem>
                                                        <SelectItem value="2">
                                                            Nasional
                                                        </SelectItem>
                                                        <SelectItem value="3">
                                                            Regional
                                                        </SelectItem>
                                                        <SelectItem value="4">
                                                            Provinsi
                                                        </SelectItem>
                                                        <SelectItem value="5">
                                                            Universitas
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.level && (
                                                    <small className="text-xs text-red-500">
                                                        * {errors.level}
                                                    </small>
                                                )}
                                            </div>
                                            <div className="w-full">
                                                <Label className="uppercase text-purple-900">
                                                    Status
                                                </Label>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(value) =>
                                                        setData(
                                                            "status",
                                                            value.toString()
                                                        )
                                                    }
                                                    required
                                                >
                                                    <SelectTrigger className="w-full mt-2">
                                                        <SelectValue placeholder="Pilih Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem
                                                            value="completed"
                                                            defaultChecked
                                                        >
                                                            Selesai
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.status && (
                                                    <small className="text-xs text-red-500">
                                                        * {errors.status}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full flex flex-col md:flex-row gap-5">
                                            <div className="w-full">
                                                <Label className="uppercase text-purple-900">
                                                    Tanggal Mulai - Selesai
                                                </Label>
                                                <div className="grid-gap-2 mt-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                id="date"
                                                                variant={
                                                                    "outline"
                                                                }
                                                                className={cn(
                                                                    "w-[300px] justify-start text-left font-normal",
                                                                    !date &&
                                                                        "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon />
                                                                {date?.from ? (
                                                                    date.to ? (
                                                                        <>
                                                                            {format(
                                                                                date.from,
                                                                                "LLL dd, y"
                                                                            )}{" "}
                                                                            -{" "}
                                                                            {format(
                                                                                date.to,
                                                                                "LLL dd, y"
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        format(
                                                                            date.from,
                                                                            "LLL dd, y"
                                                                        )
                                                                    )
                                                                ) : (
                                                                    <span>
                                                                        Pick a
                                                                        date
                                                                    </span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-auto p-0"
                                                            align="start"
                                                        >
                                                            <Calendar
                                                                initialFocus
                                                                mode="range"
                                                                defaultMonth={
                                                                    date?.from
                                                                }
                                                                selected={date}
                                                                onSelect={
                                                                    setDate
                                                                }
                                                                numberOfMonths={
                                                                    2
                                                                }
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                {errors.start_date && (
                                                    <small className="text-xs text-red-500">
                                                        * {errors.start_date}
                                                    </small>
                                                )}
                                                {errors.end_date && (
                                                    <small className="text-xs text-red-500">
                                                        * {errors.end_date}
                                                    </small>
                                                )}
                                            </div>
                                            <div className="w-full">
                                                <Label className="uppercase text-purple-900">
                                                    Skill yang dibutuhkan
                                                </Label>
                                                <ReactSelect
                                                    isMulti
                                                    options={skills.map(
                                                        (skill) => ({
                                                            value: skill.id,
                                                            label: skill.name
                                                        })
                                                    )}
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"
                                                    onChange={(
                                                        selectedOptions
                                                    ) => {
                                                        const selectedSkillIds =
                                                            (
                                                                selectedOptions ||
                                                                []
                                                            ).map(
                                                                (option) =>
                                                                    option.value
                                                            );
                                                        setData(
                                                            "skills",
                                                            selectedSkillIds
                                                        ); // Hanya kirim ID ke backend
                                                    }}
                                                    value={skills
                                                        .filter((skill) =>
                                                            data.skills.includes(
                                                                skill.id
                                                            )
                                                        )
                                                        .map((skill) => ({
                                                            value: skill.id,
                                                            label: skill.name
                                                        }))}
                                                />

                                                {errors.skills && (
                                                    <small className="text-xs text-red-500">
                                                        * {errors.skills}
                                                    </small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <Label className="uppercase text-purple-900">
                                                Deskripsi
                                            </Label>
                                            <Textarea
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                            ></Textarea>
                                            {errors.description && (
                                                <small className="text-xs text-red-500">
                                                    * {errors.description}
                                                </small>
                                            )}
                                        </div>
                                    </>
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader>
                                <CardTitle>Formulir Pendaftaran Tim</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <CustomInput
                                            label="Nama Tim *"
                                            value={data.team.name}
                                            onChange={(e) =>
                                                setData(
                                                    "team.name",
                                                    e.target.value
                                                )
                                            }
                                            error={errors["team.name"]}
                                            placeholder="Masukkan nama tim"
                                            type="text"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="dosen">
                                            Dosen Pembimbing *
                                        </Label>
                                        <ReactSelect<DosenOption>
                                            id="dosen"
                                            value={
                                                dosen
                                                    .filter(
                                                        (d) =>
                                                            d.id ===
                                                            data.team.dosen_id
                                                    )
                                                    .map((d) => ({
                                                        value: d.id,
                                                        label: `${d.name} (${d.identifier || ""})`,
                                                        email: d.email,
                                                        identifier:
                                                            d.identifier || ""
                                                    }))[0]
                                            }
                                            onChange={(selectedOption) => {
                                                setData(
                                                    "team.dosen_id",
                                                    selectedOption
                                                        ? selectedOption.value
                                                        : 0
                                                );
                                            }}
                                            options={dosen.map((d) => ({
                                                value: d.id,
                                                label: `${d.name} (${d.identifier || ""})`,
                                                email: d.email,
                                                identifier: d.identifier || ""
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
                                                        .includes(searchValue)
                                                );
                                            }}
                                            noOptionsMessage={() =>
                                                "Tidak ada dosen ditemukan"
                                            }
                                        />
                                        {errors["team.dosen_id"] && (
                                            <small className="text-red-600 text-xs">
                                                * {errors["team.dosen_id"]}
                                            </small>
                                        )}
                                    </div>
                                </div>

                                {/* Team Leader */}
                                <div className="mt-2">
                                    <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                                        <UserCheck className="h-4 w-4" />
                                        Ketua Tim
                                    </Label>
                                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border">
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {user?.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {user?.identifier} •{" "}
                                                {user?.email}
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

                                {/* Team Members */}
                                <div className="mt-4">
                                    <Label className="text-sm font-medium flex items-center gap-2 mb-1">
                                        <Users2 className="h-4 w-4" />
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
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removeTeamMember(
                                                                            member.id ??
                                                                                0
                                                                        )
                                                                    }
                                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

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
                                            setData(
                                                "achievement.name",
                                                e.target.value
                                            )
                                        }
                                        value={data.achievement.name}
                                        error={errors["achievement.name"]}
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
                                            setData(
                                                "achievement.score",
                                                Number(e.target.value)
                                            )
                                        }
                                        value={data.achievement.score.toString()}
                                        error={errors["achievement.score"]}
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
                                    {[
                                        ...teamMembers,
                                        {
                                            id: user?.id ?? 0,
                                            name: user?.name ?? "Anda"
                                        }
                                    ].map((member) => {
                                        const uploaded = data.certificates.find(
                                            (c) => c.user_id === member.id
                                        )?.file;

                                        return (
                                            <div key={member.id}>
                                                <Label className="mb-2 block text-sm font-medium text-gray-700">
                                                    Sertifikat untuk{" "}
                                                    {member.name}
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
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="w-full flex justify-end">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {processing ? "Loading..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DosenLayout>
    );
}
