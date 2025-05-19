import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Eye } from "lucide-react";
import { Link } from "@inertiajs/react";
import type { User as UserType } from "@/types/profile";
import "../../../../../css/dashboard-admin.css";

interface ProfileCardProps {
    user: UserType;
    showDetailButton?: boolean;
    className?: string;
}

export default function ProfileCard({
    user,
    showDetailButton = true,
    className
}: ProfileCardProps) {
    const colorClass =
        className || "bg-gradient-to-br from-white to-blue-50/20";

    return (
        <div className="admin-card">
            <div className="admin-card-header">Profil</div>
            <div className="admin-card-content">
                <Card
                    className={`border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all ${colorClass}`}
                >
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-purple-100/40 text-sepia-700 rounded-full flex items-center justify-center mb-4 ring-2 ring-sepia-200 transition-all duration-300 hover:ring-sepia-400 hover:bg-purple-100/60">
                                {user?.image_url ? (
                                    <img
                                        src={user.image_url}
                                        alt="Foto Profil"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <User
                                        size={32}
                                        className="text-sepia-600"
                                    />
                                )}
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg hover:text-sepia-700 transition-colors duration-300">
                                {user?.name || "Admin"}
                            </h3>
                            <p className="text-gray-600 mb-4 hover:text-gray-800 transition-colors duration-300">
                                {user?.email || "admin@example.com"}
                            </p>
                            <div className="w-full py-2 px-3 bg-purple-50/50 rounded-md text-center text-sm text-sepia-700 font-medium mb-3 transition-all duration-300 hover:bg-purple-100/70">
                                {user?.role || "Administrator"}
                            </div>

                            {/* Tampilkan data dosen jika ada */}
                            {user?.dosen && (
                                <div className="w-full space-y-2 mb-3 text-left">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Fakultas:
                                        </span>{" "}
                                        {user.dosen.faculty}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Jurusan:
                                        </span>{" "}
                                        {user.dosen.major}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Alamat:
                                        </span>{" "}
                                        {user.dosen.address}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-medium">
                                            Jenis Kelamin:
                                        </span>{" "}
                                        {user.dosen.gender}
                                    </div>
                                </div>
                            )}

                            {showDetailButton && (
                                <Link href={route("profile.show")}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100/50 border border-purple-200 rounded-md transition-all duration-300 hover:border-purple-400"
                                    >
                                        Lihat Detail
                                        <Eye size={16} className="ml-2" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
