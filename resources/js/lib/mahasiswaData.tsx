import { User, Award, Trophy, Flag } from "lucide-react";
import { Stat} from "../types/user/admin";

export const stats: Stat[] = [
    {
        label: "Mahasiswa Aktif",
        value: "783",
        icon: <User className="text-blue-500" />
    },
    {
        label: "Kompetisi Yang Diikuti",
        value: "4",
        icon: <Flag className="text-purple-500" />
    },
    {
        label: "Riwayat Lomba",
        value: "24",
        icon: <Trophy className="text-green-500" />
    },
    {
        label: "Menang",
        value: "18",
        icon: <Award className="text-amber-500" />
    }
];
