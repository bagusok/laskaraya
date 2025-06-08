import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { router, usePage } from "@inertiajs/react";
import { useProfileForm } from "@/hooks/use-profile";
import type { UserRole } from "@/types/profile.d";
import { useEffect, useState } from "react";
import { Camera, ArrowLeft, X } from "lucide-react";
import React from "react";
import axios from "axios";

// Tambahkan tipe untuk skills di form
interface SkillForm {
    id: number;
    level: number;
}

export default function EditProfile() {
    const {
        register,
        handleSubmit,
        errors,
        setValue,
        onSubmit,
        isLoading,
        user,
        watch
    } = useProfileForm() as any; // pastikan watch diambil dari sini

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const prodiList = (usePage().props.prodiList ?? []) as any[];
    const skills = (usePage().props.skills ?? []) as {
        id: number;
        name: string;
    }[];
    const userSkills = (usePage().props.userSkills ?? []) as {
        id: number;
        name: string;
        level: number;
    }[];
    const [selectedSkills, setSelectedSkills] =
        useState<{ id: number; name: string; level: number }[]>(userSkills);

    const [totalCompetitions, setTotalCompetitions] = useState<number>(
        user?.dosen?.total_competitions ?? 0
    );
    const [totalWins, setTotalWins] = useState<number>(
        user?.dosen?.total_wins ?? 0
    );

    useEffect(() => {
        setValue(
            "skills",
            selectedSkills.map((s) => ({ id: s.id, level: s.level }))
        );
    }, [selectedSkills, setValue]);

    useEffect(() => {
        setValue("total_competitions", user?.dosen?.total_competitions ?? 0);
        setValue("total_wins", user?.dosen?.total_wins ?? 0);
    }, [setValue, user]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSkillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(
            (opt) => Number(opt.value)
        );
        // Tambahkan skill baru yang dipilih, default level 1
        const newSkills = selectedOptions.map((id) => {
            const existing = selectedSkills.find((s) => s.id === id);
            if (existing) return existing;
            const skill = skills.find((s) => s.id === id);
            return { id, name: skill?.name || "", level: 1 };
        });
        setSelectedSkills(newSkills);
    };

    const handleLevelChange = (id: number, level: number) => {
        setSelectedSkills(
            selectedSkills.map((s) => (s.id === id ? { ...s, level } : s))
        );
    };

    const handleSubmitWithLog = async (data: any) => {
        // Buat FormData manual
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("identifier", data.identifier);
        formData.append("phone", data.phone);
        formData.append("role", data.role);
        if (data.password) formData.append("password", data.password);
        if (data.image && data.image[0])
            formData.append("image", data.image[0]);
        formData.append(
            "is_verified",
            data.is_verified === true || data.is_verified === "true" ? "1" : "0"
        );
        formData.append("address", data.address ?? "");
        formData.append("faculty", data.faculty ?? "");
        formData.append("major", data.major ?? "");
        formData.append("gender", data.gender ?? "");
        formData.append("birth_place", data.birth_place ?? "");
        formData.append("birth_date", data.birth_date ?? "");
        formData.append("total_competitions", String(totalCompetitions));
        formData.append("total_wins", String(totalWins));
        if (data.prodi_id) formData.append("prodi_id", data.prodi_id);
        if (selectedSkills.length > 0)
            formData.append(
                "skills",
                JSON.stringify(
                    selectedSkills.map((s) => ({ id: s.id, level: s.level }))
                )
            );

        // Debug
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }

        try {
            await axios.post(route("profile.update"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
                params: { _method: "PUT" }
            });
            window.location.href = route("profile.show");
        } catch (err) {
            alert("Gagal update profil. Cek console/log untuk detail.");
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        onClick={() => router.visit(route("profile.show"))}
                        className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500 hover:text-purple-900 transition-colors duration-200"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Button>
                </div>

                <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all bg-gradient-to-br from-white to-blue-50/20">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Edit Profil
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(handleSubmitWithLog as any)}
                            className="space-y-6"
                            encType="multipart/form-data"
                        >
                            <div className="flex flex-col items-center space-y-4 mb-6">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-200">
                                        <img
                                            src={
                                                previewImage || user?.image_url
                                            }
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <label
                                        htmlFor="image"
                                        className="absolute bottom-0 right-0 bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors"
                                    >
                                        <Camera size={20} />
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            handleImageChange(e);
                                            setValue(
                                                "image",
                                                e.target.files ?? undefined
                                            );
                                        }}
                                    />
                                </div>
                                {errors.image && (
                                    <p className="text-sm text-red-500">
                                        {errors.image.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="name"
                                        className="text-gray-700"
                                    >
                                        Nama
                                    </Label>
                                    <Input
                                        id="name"
                                        {...register("name")}
                                        placeholder="Masukkan nama"
                                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-gray-700"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        placeholder="Masukkan email"
                                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="identifier"
                                        className="text-gray-700"
                                    >
                                        NIP/NIM
                                    </Label>
                                    <Input
                                        id="identifier"
                                        {...register("identifier")}
                                        placeholder="Masukkan NIP/NIM"
                                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                    {errors.identifier && (
                                        <p className="text-sm text-red-500">
                                            {errors.identifier.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="phone"
                                        className="text-gray-700"
                                    >
                                        Nomor Telepon
                                    </Label>
                                    <Input
                                        id="phone"
                                        {...register("phone")}
                                        placeholder="Masukkan nomor telepon"
                                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="role"
                                        className="text-gray-700"
                                    >
                                        Role
                                    </Label>
                                    <Select
                                        onValueChange={(value) =>
                                            setValue("role", value as UserRole)
                                        }
                                        defaultValue={user?.role}
                                    >
                                        <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">
                                                Admin
                                            </SelectItem>
                                            <SelectItem value="dosen">
                                                Dosen
                                            </SelectItem>
                                            <SelectItem value="mahasiswa">
                                                Mahasiswa
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-sm text-red-500">
                                            {errors.role.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-gray-700"
                                    >
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register("password")}
                                        placeholder="Masukkan password baru (opsional)"
                                        className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Tambahan field untuk dosen */}
                                {(user?.role === "dosen" ||
                                    user?.role === "admin") && (
                                    <>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="address"
                                                className="text-gray-700"
                                            >
                                                Alamat
                                            </Label>
                                            <Input
                                                id="address"
                                                {...register("address")}
                                                placeholder="Masukkan alamat"
                                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                            {errors.address && (
                                                <p className="text-sm text-red-500">
                                                    {errors.address.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="faculty"
                                                className="text-gray-700"
                                            >
                                                Jurusan
                                            </Label>
                                            <Input
                                                id="faculty"
                                                {...register("faculty")}
                                                placeholder="Masukkan jurusan"
                                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                            {errors.faculty && (
                                                <p className="text-sm text-red-500">
                                                    {errors.faculty.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="gender"
                                                className="text-gray-700"
                                            >
                                                Jenis Kelamin
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setValue(
                                                        "gender",
                                                        value === "L"
                                                            ? "L"
                                                            : "P"
                                                    )
                                                }
                                                defaultValue={
                                                    user?.dosen?.gender === "L"
                                                        ? "L"
                                                        : user?.dosen
                                                                ?.gender === "P"
                                                          ? "P"
                                                          : undefined
                                                }
                                            >
                                                <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="L">
                                                        L
                                                    </SelectItem>
                                                    <SelectItem value="P">
                                                        P
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.gender && (
                                                <p className="text-sm text-red-500">
                                                    {errors.gender.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="birth_place"
                                                className="text-gray-700"
                                            >
                                                Tempat Lahir
                                            </Label>
                                            <Input
                                                id="birth_place"
                                                {...register("birth_place")}
                                                placeholder="Masukkan tempat lahir"
                                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                            {errors.birth_place && (
                                                <p className="text-sm text-red-500">
                                                    {errors.birth_place.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="birth_date"
                                                className="text-gray-700"
                                            >
                                                Tanggal Lahir
                                            </Label>
                                            <Input
                                                id="birth_date"
                                                type="date"
                                                {...register("birth_date")}
                                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                            {errors.birth_date && (
                                                <p className="text-sm text-red-500">
                                                    {errors.birth_date.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="major"
                                                className="text-gray-700"
                                            >
                                                Program Studi
                                            </Label>
                                            <Select
                                                onValueChange={(value) =>
                                                    setValue("major", value)
                                                }
                                                defaultValue={
                                                    user?.dosen?.major || ""
                                                }
                                            >
                                                <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                                                    <SelectValue placeholder="Pilih Program Studi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {prodiList.map(
                                                        (prodi: any) => (
                                                            <SelectItem
                                                                key={prodi.id}
                                                                value={
                                                                    prodi.nama
                                                                }
                                                            >
                                                                {prodi.nama}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.major && (
                                                <p className="text-sm text-red-500">
                                                    {errors.major.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="total_competitions"
                                                className="text-gray-700"
                                            >
                                                Total Lomba
                                            </Label>
                                            <Input
                                                id="total_competitions"
                                                type="text"
                                                {...register(
                                                    "total_competitions"
                                                )}
                                                value={totalCompetitions}
                                                onChange={(e) =>
                                                    setTotalCompetitions(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                placeholder="Masukkan total lomba"
                                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                            <input
                                                type="hidden"
                                                name="total_competitions"
                                                value={totalCompetitions}
                                            />
                                            {errors.total_competitions && (
                                                <p className="text-sm text-red-500">
                                                    {
                                                        errors
                                                            .total_competitions
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="total_wins"
                                                className="text-gray-700"
                                            >
                                                Total Kemenangan
                                            </Label>
                                            <Input
                                                id="total_wins"
                                                type="text"
                                                {...register("total_wins")}
                                                value={totalWins}
                                                onChange={(e) =>
                                                    setTotalWins(
                                                        Number(e.target.value)
                                                    )
                                                }
                                                placeholder="Masukkan total kemenangan"
                                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                            <input
                                                type="hidden"
                                                name="total_wins"
                                                value={totalWins}
                                            />
                                            {errors.total_wins && (
                                                <p className="text-sm text-red-500">
                                                    {errors.total_wins.message}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {user?.role === "mahasiswa" && (
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="prodi_id"
                                            className="text-gray-700"
                                        >
                                            Prodi
                                        </Label>
                                        <Select
                                            onValueChange={(value) =>
                                                setValue("prodi_id", value)
                                            }
                                            defaultValue={
                                                user?.mahasiswa?.prodi_id
                                                    ? String(
                                                          user?.mahasiswa
                                                              ?.prodi_id
                                                      )
                                                    : ""
                                            }
                                        >
                                            <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                                                <SelectValue placeholder="Pilih Program Studi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {prodiList.map((prodi: any) => (
                                                    <SelectItem
                                                        key={prodi.id}
                                                        value={String(prodi.id)}
                                                    >
                                                        {prodi.nama}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.prodi_id && (
                                            <p className="text-sm text-red-500">
                                                {errors.prodi_id.message}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Field Skill tanpa Card */}
                                <div className="space-y-2 mb-6">
                                    <Label className="text-gray-700">
                                        Skill
                                    </Label>
                                    <Select
                                        onValueChange={(value) => {
                                            const id = Number(value);
                                            if (
                                                !selectedSkills.some(
                                                    (s) => s.id === id
                                                )
                                            ) {
                                                const skill = skills.find(
                                                    (s) => s.id === id
                                                );
                                                if (skill)
                                                    setSelectedSkills([
                                                        ...selectedSkills,
                                                        {
                                                            id,
                                                            name: skill.name,
                                                            level: 1
                                                        }
                                                    ]);
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                                            <SelectValue placeholder="Pilih Skill" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {skills
                                                .filter(
                                                    (skill) =>
                                                        !selectedSkills.some(
                                                            (s) =>
                                                                s.id ===
                                                                skill.id
                                                        )
                                                )
                                                .map((skill) => (
                                                    <SelectItem
                                                        key={skill.id}
                                                        value={String(skill.id)}
                                                    >
                                                        {skill.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {selectedSkills.length === 0 && (
                                            <div className="text-xs text-gray-400">
                                                Belum ada skill yang dipilih
                                            </div>
                                        )}
                                        {selectedSkills.map((skill) => (
                                            <div
                                                key={skill.id}
                                                className="flex items-center gap-2 border border-purple-200 rounded px-2 py-1 bg-white shadow-sm"
                                            >
                                                <span className="text-sm text-gray-800 w-28">
                                                    {skill.name}
                                                </span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (num) => (
                                                            <button
                                                                key={num}
                                                                type="button"
                                                                className={`w-6 h-6 rounded border text-xs font-bold transition-colors
                                                                ${skill.level === num ? "bg-purple-500 text-white border-purple-500" : "bg-white text-purple-700 border-purple-200 hover:bg-purple-100"}`}
                                                                onClick={() =>
                                                                    handleLevelChange(
                                                                        skill.id,
                                                                        num
                                                                    )
                                                                }
                                                            >
                                                                {num}
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    className="text-red-400 hover:text-red-600"
                                                    onClick={() =>
                                                        setSelectedSkills(
                                                            selectedSkills.filter(
                                                                (s) =>
                                                                    s.id !==
                                                                    skill.id
                                                            )
                                                        )
                                                    }
                                                    title="Hapus"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {errors?.skills && (
                                        <p className="text-sm text-red-500">
                                            {errors.skills.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-purple-500 hover:bg-purple-600"
                                >
                                    {isLoading
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
