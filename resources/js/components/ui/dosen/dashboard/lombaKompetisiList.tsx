import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Plus } from "lucide-react";
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

interface Lomba {
    id: number;
    name: string;
    category: {
        id: number;
        name: string;
    };
    start_date: string;
    end_date: string;
    status: string;
    members: CompetitionMember[];
}

interface LombaKompetisiListProps {
    data: Lomba[];
}

export default function LombaKompetisiList({ data }: LombaKompetisiListProps) {
    return (
        <div className="admin-card">
            <div className="admin-card-header">Daftar Lomba/Kompetisi</div>
            <div className="admin-card-content">
                <Card className="border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all bg-gradient-to-br from-white to-blue-50/20">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Lomba/Kompetisi
                            </CardTitle>
                            <Button
                                variant="default"
                                size="sm"
                                className="text-sm flex items-center gap-1 bg-blue-600 hover:bg-blue-700 transition-all"
                            >
                                <Plus size={16} /> Tambah Lomba
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            {data.map((lomba) => (
                                <div
                                    key={lomba.id}
                                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-blue-100/30 hover:scale-[1.02] hover:shadow-sm rounded-md px-2 transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100/30 rounded-md mr-4">
                                            <Calendar
                                                size={18}
                                                className="text-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 hover:text-blue-700 transition-colors duration-200">
                                                {lomba.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    lomba.start_date
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}{" "}
                                                -{" "}
                                                {new Date(
                                                    lomba.end_date
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric"
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-blue-100/30 px-3 py-1 rounded-full text-blue-700 hover:bg-blue-200/50 transition-colors duration-200">
                                            {lomba.category.name}
                                        </span>
                                        <span className="text-xs bg-green-100/30 px-3 py-1 rounded-full text-green-700 hover:bg-green-200/50 transition-colors duration-200">
                                            {lomba.members.length} Peserta
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
