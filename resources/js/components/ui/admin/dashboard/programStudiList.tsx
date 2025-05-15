import "../../../../../css/dashboard-admin.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pencil } from "lucide-react";

interface Program {
    id: number;
    name: string;
    students: number;
    competitions: number;
}

interface ProgramStudiListProps {
    programs: Program[];
    className?: string;
}

export default function ProgramStudiList({
    programs,
    className
}: ProgramStudiListProps) {
    const colorClass =
        className || "bg-gradient-to-br from-white to-blue-50/20";

    return (
        <div className="admin-card">
            <div className="admin-card-header">Daftar Program Studi</div>
            <div className="admin-card-content">
                <Card
                    className={`border-1 border-purple-300 hover:shadow-md shadow-purple-300 transition-all ${colorClass}`}
                >
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-xl font-bold text-gray-900">
                                Program Studi
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                            >
                                Kelola <ArrowRight size={16} className="ml-1" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            {programs.map((program, index) => (
                                <div
                                    key={index}
                                    className="py-4 border-b border-gray-100 last:border-0 group hover:bg-purple-100/30 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 rounded-lg px-2"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <h3 className="font-medium text-gray-900 group-hover:text-purple-700 transition-colors duration-200">
                                                {program.name}
                                            </h3>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="ml-2 p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-purple-50"
                                            >
                                                <Pencil
                                                    size={14}
                                                    className="text-gray-400 hover:text-purple-600 transition-colors duration-200"
                                                />
                                            </Button>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors duration-200">
                                                {program.students} Mahasiswa
                                            </span>
                                            <span className="text-sm text-gray-500 group-hover:text-purple-600 transition-colors duration-200">
                                                {program.competitions} Kompetisi
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden group-hover:bg-purple-100 transition-colors duration-200">
                                        <div
                                            className="bg-purple-500 h-full rounded-full group-hover:bg-purple-600 transition-colors duration-200"
                                            style={{
                                                width: `${Math.min(100, (program.competitions / 20) * 100)}%`
                                            }}
                                        ></div>
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
