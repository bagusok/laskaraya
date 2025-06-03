import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Link } from "@inertiajs/react";

export type Achievement = {
    id: number;
    name: string;
    competition: {
        name: string;
        status: string;
        verified_status: string;
    };
    competitionMembers: {
        user: {
            name: string;
            identifier: string;
        };
    }[];
    achievement?: {
        name: string;
        champion: number;
        score: number;
    };
    bimbingan_status: string;
    created_at: string;
};

export const achievementColumns = (): ColumnDef<Achievement>[] => [
    {
        accessorKey: "name",
        header: "Nama Tim",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        )
    },
    {
        accessorKey: "competition.name",
        header: "Kompetisi",
        cell: ({ row }) => <div>{row.original.competition.name}</div>
    },
    {
        accessorKey: "competitionMembers",
        header: "Anggota",
        cell: ({ row }) => (
            <div className="space-y-1">
                {row.original.competitionMembers.map((member, idx) => (
                    <div key={idx} className="text-sm">
                        {member.user.name} ({member.user.identifier})
                    </div>
                ))}
            </div>
        )
    },
    {
        accessorKey: "achievement",
        header: "Prestasi",
        cell: ({ row }) => {
            const achievement = row.original.achievement;
            if (!achievement)
                return <Badge variant="destructive">Belum Ada</Badge>;

            return (
                <div className="space-y-1">
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-sm text-muted-foreground">
                        Juara {achievement.champion} | Skor: {achievement.score}
                    </div>
                </div>
            );
        }
    },
    {
        accessorKey: "competition.status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.competition.status;
            const verifiedStatus = row.original.competition.verified_status;

            if (status === "ongoing") {
                return <Badge variant="secondary">Sedang Berlangsung</Badge>;
            }

            if (status === "completed" && verifiedStatus === "pending") {
                return (
                    <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                    >
                        Menunggu Verifikasi
                    </Badge>
                );
            }

            if (status === "completed" && verifiedStatus === "accepted") {
                return (
                    <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                    >
                        Selesai
                    </Badge>
                );
            }

            return <Badge variant="destructive">Dibatalkan</Badge>;
        }
    },
    {
        accessorKey: "bimbingan_status",
        header: "Status Bimbingan",
        cell: ({ row }) => {
            const status = row.getValue("bimbingan_status") as string;

            if (status === "selesai") {
                return (
                    <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                    >
                        Selesai
                    </Badge>
                );
            }

            return <Badge variant="secondary">Dalam Bimbingan</Badge>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <Button variant="ghost" size="icon" asChild>
                    <Link
                        href={route("dosen.achievements.show", row.original.id)}
                    >
                        <Eye className="h-4 w-4" />
                    </Link>
                </Button>
            );
        }
    }
];
