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

    return (
        <AdminLayout>
            <div className="container mx-auto py-6">
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
                        >
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
                                        Identifier
                                    </Label>
                                    <Input
                                        id="identifier"
                                        {...register("identifier")}
                                        placeholder="Masukkan identifier"
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

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_verified"
                                        {...register("is_verified")}
                                        className="border-purple-200 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                                    />
                                    <Label
                                        htmlFor="is_verified"
                                        className="text-gray-700"
                                    >
                                        Verifikasi Akun
                                    </Label>
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                        Ubah Password
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="password"
                                                className="text-gray-700"
                                            >
                                                Password Baru
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
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        router.visit(route("dashboard"))
                                    }
                                    className="border-purple-200 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
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
