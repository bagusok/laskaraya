import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DosenLayout from "@/components/layouts/dosenLayout";
import MahasiswaBimbinganTable from "@/components/ui/dosen/mahasiswaBimbinganTable";
import { PaginatedProps } from "@/types/paginatedProps";
import { MahasiswaBimbingan } from "@/types/user/user";

export default function MahasiswaBimbinganPage({
    mahasiswa,
    mahasiswaList
}: {
    mahasiswa: PaginatedProps<MahasiswaBimbingan>;
    mahasiswaList: any[];
}) {
    return (
        <DosenLayout title="Manajemen Mahasiswa Bimbingan">
            <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all bg-gradient-to-br from-white to-blue-50/20">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-gray-900">
                            Manajemen Mahasiswa Bimbingan
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <MahasiswaBimbinganTable
                        mahasiswa={mahasiswa}
                        mahasiswaList={mahasiswaList}
                    />
                </CardContent>
            </Card>
        </DosenLayout>
    );
}
