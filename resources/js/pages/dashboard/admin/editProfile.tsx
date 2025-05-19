import AdminLayout from "@/components/layouts/adminLayout";
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
import { Checkbox } from "@/components/ui/checkbox";
import { router } from "@inertiajs/react";
import { useProfileForm } from "@/hooks/use-profile";
import type { UserRole } from "@/types/profile.d";
import { useState, useEffect } from "react";
import { Camera, ArrowLeft } from "lucide-react";

export default function EditProfile() {
    const {
        register,
        handleSubmit,
        errors,
        setValue,
        onSubmit,
        isLoading,
        user
    } = useProfileForm();

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [prodiList, setProdiList] = useState([]);

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

    useEffect(() => {
        fetch("/program-studi/get-all")
            .then((res) => res.json())
            .then((data) => setProdiList(data));
    }, []);

    return (
        <AdminLayout>
            <div className="container mx-auto">
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
                            onSubmit={handleSubmit(onSubmit as any)}
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
                                                Fakultas
                                            </Label>
                                            <Input
                                                id="faculty"
                                                {...register("faculty")}
                                                placeholder="Masukkan fakultas"
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
                                                htmlFor="major"
                                                className="text-gray-700"
                                            >
                                                Jurusan
                                            </Label>
                                            <Input
                                                id="major"
                                                {...register("major")}
                                                placeholder="Masukkan jurusan"
                                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                            />
                                            {errors.major && (
                                                <p className="text-sm text-red-500">
                                                    {errors.major.message}
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
                                    </>
                                )}

                                {user?.role === "mahasiswa" && (
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="prodi_id"
                                            className="text-gray-700"
                                        >
                                            Program Studi
                                        </Label>
                                        <select
                                            id="prodi_id"
                                            {...register("prodi_id")}
                                            defaultValue={user?.prodi_id || ""}
                                            className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                        >
                                            <option value="">
                                                Pilih Program Studi
                                            </option>
                                            {prodiList.map((prodi: any) => (
                                                <option
                                                    key={prodi.id}
                                                    value={prodi.id}
                                                >
                                                    {prodi.nama}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.prodi_id && (
                                            <p className="text-sm text-red-500">
                                                {errors.prodi_id.message}
                                            </p>
                                        )}
                                    </div>
                                )}
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
        </AdminLayout>
    );
}
