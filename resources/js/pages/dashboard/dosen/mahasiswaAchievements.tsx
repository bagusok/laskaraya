import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DosenLayout from "@/components/layouts/dosenLayout";
import DataTable from "@/components/ui/shared/dataTable";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Eye } from "lucide-react";

export default function MahasiswaAchievementsPage({
    mahasiswaAchievements
}: {
    mahasiswaAchievements: any[];
}) {
    // Kolom tabel mirip dengan mahasiswaAchievementColumns, tanpa aksi
    const columns = useMemo(
        () => [
            {
                header: "Nama Mahasiswa",
                accessorKey: "mahasiswa_name"
            },
            {
                header: "Nama Tim",
                accessorKey: "team_name"
            },
            {
                header: "Prestasi",
                accessorKey: "achievement_name"
            },
            {
                header: "Kompetisi",
                accessorKey: "competition_name"
            },
            {
                header: "Tahun",
                accessorKey: "year"
            },
            {
                header: "Status",
                accessorKey: "status"
            },
            {
                accessorKey: "detail",
                header: "Detail",
                cell: ({ row }) => (
                    <Button variant="outline" size="sm" asChild>
                        <Link
                            href={route(
                                "dosen.prestasi.detail",
                                row.original.team_id
                            )}
                            className="flex items-center gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            Detail
                        </Link>
                    </Button>
                )
            }
        ],
        []
    );

    return (
        <DosenLayout title="Riwayat Prestasi Mahasiswa Bimbingan">
            <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all bg-gradient-to-br from-white to-blue-50/20">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-gray-900">
                            Riwayat Prestasi Mahasiswa Bimbingan
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <DataTable columns={columns} data={mahasiswaAchievements} />
                </CardContent>
            </Card>
        </DosenLayout>
    );
}
