import AdminLayout from "@/components/layouts/adminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { router, usePage } from "@inertiajs/react";
import {
    ArrowLeft,
    Pencil,
    User as UserIcon,
    Mail,
    Phone,
    Briefcase,
    MapPin,
    Building,
    Calendar,
    BadgeInfo
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types/profile";
import Header from "@/components/ui/admin/dashboard/header";
import { motion } from "framer-motion";
import React from "react";

interface ProfileDetailProps {
    user: User;
}

export default function ProfileDetail({ user }: ProfileDetailProps) {
    // Get initials for avatar fallback
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Dummy handler for sidebar toggle (bisa dihubungkan ke state layout jika ada)
    const handleSidebar = () => {};

    const userSkills = (usePage().props.userSkills ?? []) as {
        id: number;
        name: string;
        level: number;
    }[];

    console.log("USER SKILLS:", userSkills);

    return (
        <AdminLayout>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="container mx-auto "
            >
                {/* Header with navigation and actions */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                >
                    <div>{/* Judul sudah di header */}</div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => router.visit(route("dashboard"))}
                            className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500 hover:text-purple-900 transition-colors duration-200"
                        >
                            <ArrowLeft size={16} />
                            Kembali
                        </Button>
                        <Button
                            onClick={() => router.visit(route("profile.edit"))}
                            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white transition-colors duration-200 shadow-sm"
                        >
                            <Pencil size={16} />
                            Edit Profil
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Profile Card - Left Column */}
                    <Card className="lg:col-span-1 border border-purple-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                        <CardContent className="flex flex-col items-center p-6">
                            <div className="mb-6 mt-2">
                                <Avatar className="w-28 h-28 border-4 border-purple-100">
                                    <AvatarImage
                                        src={user.image_url}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="text-xl bg-purple-100 text-purple-700">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <h2 className="text-xl font-bold text-center">
                                {user.name}
                            </h2>
                            <p className="text-gray-500 mb-2">
                                {user.identifier}
                            </p>

                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 mt-1 mb-4">
                                {user.role.charAt(0).toUpperCase() +
                                    user.role.slice(1)}
                            </div>

                            <Separator className="my-4" />

                            <div className="w-full space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="text-gray-500" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Email
                                        </p>
                                        <p className="font-medium">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Phone
                                        className="text-gray-500"
                                        size={18}
                                    />
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Telepon
                                        </p>
                                        <p className="font-medium">
                                            {user.phone}
                                        </p>
                                    </div>
                                </div>

                                {user.dosen && (
                                    <div className="flex items-center gap-3">
                                        <Building
                                            className="text-gray-500"
                                            size={18}
                                        />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Fakultas
                                            </p>
                                            <p className="font-medium">
                                                {user.dosen.faculty}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Main Content - Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information Card */}
                        <Card className="border border-purple-200 rounded-xl shadow-sm">
                            <CardHeader className="pb-2 border-b border-purple-100">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <UserIcon
                                        size={20}
                                        className="text-purple-600"
                                    />
                                    Informasi Pribadi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                                            Nama Lengkap
                                        </h3>
                                        <p className="text-base">{user.name}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                                            NIP/NIM
                                        </h3>
                                        <p className="text-base">
                                            {user.identifier}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                                            Email
                                        </h3>
                                        <p className="text-base">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                                            Telepon
                                        </h3>
                                        <p className="text-base">
                                            {user.phone}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500 mb-1">
                                            Role
                                        </h3>
                                        <p className="text-base capitalize">
                                            {user.role}
                                        </p>
                                    </div>
                                    {user.dosen && user.dosen.faculty && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Jurusan
                                            </h3>
                                            <p className="text-base">
                                                {user.dosen.faculty}
                                            </p>
                                        </div>
                                    )}
                                    {user.mahasiswa && (
                                        <>
                                            {user.mahasiswa.faculty && (
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                        Fakultas
                                                    </h3>
                                                    <p className="text-base">
                                                        {user.mahasiswa.faculty}
                                                    </p>
                                                </div>
                                            )}
                                            {user.mahasiswa.major && (
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                        Jurusan
                                                    </h3>
                                                    <p className="text-base">
                                                        {user.mahasiswa.major}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {user.mahasiswa && user.prodi && (
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Program Studi
                                            </h3>
                                            <p className="text-base">
                                                {user.prodi.nama}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {/* Tampilkan skill user */}
                                {userSkills && userSkills.length > 0 ? (
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                                            Skill Mahasiswa
                                        </h3>
                                        <ul className="list-disc pl-5">
                                            {userSkills.map((s: any) => (
                                                <li key={s.id} className="mb-1">
                                                    <span className="font-semibold">
                                                        {s.name}
                                                    </span>{" "}
                                                    <span className="text-xs text-gray-500">
                                                        (Tingkat Keterampilan:{" "}
                                                        {s.level})
                                                    </span>
                                                    {/* Debug */}
                                                    {/* <span className="text-xs text-gray-400 ml-2">user_id: {s.user_id}, skill_id: {s.id}</span> */}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="mt-6 text-xs text-gray-400">
                                        Belum ada skill yang diinputkan
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Additional Information Card - Conditional */}
                        {user.dosen && (
                            <Card className="border border-purple-200 rounded-xl shadow-sm">
                                <CardHeader className="pb-2 border-b border-purple-100">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <BadgeInfo
                                            size={20}
                                            className="text-blue-600"
                                        />
                                        Informasi Tambahan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Alamat
                                            </h3>
                                            <p className="text-base">
                                                {user.dosen.address}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Fakultas
                                            </h3>
                                            <p className="text-base">
                                                {user.dosen.faculty}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Jurusan
                                            </h3>
                                            <p className="text-base">
                                                {user.dosen.major}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Jenis Kelamin
                                            </h3>
                                            <p className="text-base">
                                                {user.dosen.gender}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Tempat Lahir
                                            </h3>
                                            <p className="text-base">
                                                {user.dosen.birth_place}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">
                                                Tanggal Lahir
                                            </h3>
                                            <p className="text-base">
                                                {user.dosen.birth_date}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AdminLayout>
    );
}
