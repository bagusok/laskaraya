import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil } from "lucide-react";

interface Mahasiswa {
    nama: string;
    prestasi: string;
    kategori: string;
    tahun: number;
    status: string;
}

interface MahasiswaBimbinganListProps {
    data: Mahasiswa[];
}

export default function MahasiswaBimbinganList({
    data
}: MahasiswaBimbinganListProps) {
    return (
        <div className="admin-card">
            <div className="admin-card-header">Daftar Mahasiswa Bimbingan</div>
            <div className="admin-card-content">
                <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all bg-gradient-to-br from-white to-blue-50/20">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Mahasiswa Bimbingan
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                            >
                                Lihat Semua{" "}
                                <ArrowRight size={16} className="ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead>
                                    <tr className="text-gray-700 border-b">
                                        <th className="py-2 px-2">Nama</th>
                                        <th className="py-2 px-2">Prestasi</th>
                                        <th className="py-2 px-2">Kategori</th>
                                        <th className="py-2 px-2">Tahun</th>
                                        <th className="py-2 px-2">Status</th>
                                        <th className="py-2 px-2">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((mhs, idx) => (
                                        <tr
                                            key={idx}
                                            className="border-b last:border-0 group hover:bg-purple-100/30 hover:scale-[1.01] hover:shadow-sm transition-all duration-200 rounded-lg"
                                        >
                                            <td className="py-2 px-2 font-medium text-purple-800">
                                                {mhs.nama}
                                            </td>
                                            <td className="py-2 px-2">
                                                {mhs.prestasi}
                                            </td>
                                            <td className="py-2 px-2">
                                                {mhs.kategori}
                                            </td>
                                            <td className="py-2 px-2">
                                                {mhs.tahun}
                                            </td>
                                            <td className="py-2 px-2">
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${mhs.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                                                >
                                                    {mhs.status}
                                                </span>
                                            </td>
                                            <td className="py-2 px-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-purple-50"
                                                >
                                                    <Pencil
                                                        size={14}
                                                        className="text-gray-400 hover:text-purple-600 transition-colors duration-200"
                                                    />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
