import MahasiswaLayout from "@/components/layouts/mahasiswaLayout";
import { Team } from "../team-table/columns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@inertiajs/react";

type Props = {
    team: Team;
};
export default function JoinedTeams({ team }: Props) {
    return (
        <MahasiswaLayout>
            <div className="flex flex-col items-center mt-14 h-screen">
                <h1 className="text-2xl font-bold mb-4">
                    Kamu Sudah Terdaftar di Kompetisi Ini
                </h1>

                <p>Nama Tim : {team.name}</p>

                <Button asChild>
                    <Link
                        href={route("mahasiswa.competitions.index")}
                        className="flex items-center gap-2 mt-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </Button>
            </div>
        </MahasiswaLayout>
    );
}
