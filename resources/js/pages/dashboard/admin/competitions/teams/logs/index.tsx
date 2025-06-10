import MahasiswaLayout from "@/components/layouts/mahasiswaLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Team } from "../../team-table/columns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = {
    logs: {
        id: number;
        user_to_competition_id: number;
        name: string;
        description: string;
        date: string;
        created_at: string;
        updated_at: string;
    }[];
    team: Team;
};

export default function AddLog({ logs, team }: Props) {
    return (
        <MahasiswaLayout title="Tambah Log">
            <Button
                variant="ghost"
                className="mb-4"
                onClick={() => window.history.back()}
            >
                <ArrowLeft />
                <span className="ml-2">Kembali</span>
            </Button>

            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">Riwayat Log</h1>
                <p>Team: {team.name}</p>
            </div>

            {logs?.map((log) => (
                <Card key={log.id} className="mb-4">
                    <CardContent>
                        <div className="w-full flex justify-between">
                            <p className="text-lg font-semibold text-purple-800">
                                {new Date(log.date).toLocaleDateString(
                                    "id-ID",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric"
                                    }
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-lg">{log.name}</p>
                            <p className="text-muted-foreground line-clamp-3 text-ellipsis">
                                {log.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </MahasiswaLayout>
    );
}
