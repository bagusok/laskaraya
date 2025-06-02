import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { User } from "@/types/profile";

interface CompetitionMember {
    id: number;
    user_id: number;
    user_to_competition_id: number;
    user: User;
    userToCompetition: {
        id: number;
        name: string;
        competition_id: number;
        status: "pending" | "accepted" | "rejected";
        competition: {
            id: number;
            name: string;
            category: {
                id: number;
                name: string;
            };
            start_date: string;
            end_date: string;
            status: string;
        };
    };
}

interface MahasiswaBimbinganListProps {
    data: CompetitionMember[];
}

export default function MahasiswaBimbinganList({
    data = []
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
                                        <th className="py-2 px-2">NIM</th>
                                        <th className="py-2 px-2">Nama Tim</th>
                                        <th className="py-2 px-2">
                                            Nama Lomba
                                        </th>
                                        <th className="py-2 px-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(data ?? []).map((member) => (
                                        <tr
                                            key={member.id}
                                            className="border-b last:border-0 group hover:bg-purple-100/30 hover:scale-[1.01] hover:shadow-sm transition-all duration-200 rounded-lg"
                                        >
                                            <td className="py-2 px-2 font-medium text-purple-800">
                                                {member.user.name}
                                            </td>
                                            <td className="py-2 px-2">
                                                {member.user.identifier}
                                            </td>
                                            <td className="py-2 px-2">
                                                {member.userToCompetition.name}
                                            </td>
                                            <td className="py-2 px-2">
                                                {
                                                    member.userToCompetition
                                                        .competition.name
                                                }
                                            </td>
                                            <td className="py-2 px-2">
                                                <span
                                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                                        member.userToCompetition
                                                            .competition
                                                            .status ===
                                                        "ongoing"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : member
                                                                    .userToCompetition
                                                                    .competition
                                                                    .status ===
                                                                "completed"
                                                              ? "bg-green-100 text-green-700"
                                                              : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {member.userToCompetition
                                                        .competition.status ===
                                                    "ongoing"
                                                        ? "Sedang Berlangsung"
                                                        : member
                                                                .userToCompetition
                                                                .competition
                                                                .status ===
                                                            "completed"
                                                          ? "Selesai"
                                                          : "Dibatalkan"}
                                                </span>
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
