import AdminLayout from "@/components/layouts/adminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Mail, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { router } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";

interface ProdiDetailProps {
    prodi: { id: number; nama: string };
    mahasiswaList: {
        id: number;
        name: string;
        email: string;
        identifier: string;
        prodi?: { nama: string };
    }[];
}

export default function ProdiDetail({
    prodi,
    mahasiswaList
}: ProdiDetailProps) {
    return (
        <AdminLayout>
            <div className="container mx-auto py-6 px-4">
                <div className="flex items-center gap-4 mb-6">
                    <Button
                        variant="outline"
                        onClick={() => router.visit(route("programStudi"))}
                        className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-500 hover:text-purple-900 transition-colors duration-200"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* Header Section */}
                    <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all rounded-2xl bg-gradient-to-br from-white to-blue-50/20">
                        <CardContent className="flex items-center gap-6 p-8">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 via-purple-200 to-white shadow-[0_2px_16px_rgba(168,85,247,0.10)]">
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-purple-900 mb-1 tracking-tight">
                                    {prodi.nama}
                                </h1>
                                <Badge
                                    variant="secondary"
                                    className="bg-white text-purple-700 border border-purple-200 px-3 py-1 text-sm font-semibold shadow-[0_2px_8px_rgba(168,85,247,0.08)]"
                                >
                                    {mahasiswaList.length} Mahasiswa
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Student List Section */}
                    <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all bg-white rounded-2xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Daftar Mahasiswa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {mahasiswaList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
                                    <UserX className="w-12 h-12 text-purple-200 mb-2" />
                                    <div className="text-lg font-semibold">
                                        Belum ada mahasiswa di prodi ini
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Ayo ajak mahasiswa untuk bergabung!
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-5">
                                    {mahasiswaList.map((mhs) => (
                                        <div
                                            key={mhs.id}
                                            className="flex flex-row justify-between items-center p-6 rounded-xl bg-white border border-purple-100 shadow-[0_2px_16px_rgba(168,85,247,0.06)] hover:shadow-[0_4px_24px_rgba(168,85,247,0.12)] transition-all w-full gap-8"
                                        >
                                            <div className="flex flex-row items-center gap-6 min-w-0 flex-1">
                                                <span className="font-bold text-lg text-gray-900 truncate">
                                                    {mhs.name}
                                                </span>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs px-3 py-1 border-gray-300 font-semibold"
                                                >
                                                    {mhs.identifier}
                                                </Badge>
                                                <div className="flex items-center gap-1 text-sm text-gray-500 min-w-0">
                                                    <Mail className="h-4 w-4" />
                                                    <span className="truncate">
                                                        {mhs.email}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-base text-gray-500 font-medium whitespace-nowrap">
                                                {mhs.prodi?.nama || prodi.nama}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
