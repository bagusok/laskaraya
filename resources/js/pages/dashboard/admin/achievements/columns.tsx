import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
import { Link } from "@inertiajs/react";
import { User } from "@/types";
import { Competition } from "../competitions/competition-table/columns";
import { Achievement } from "../competitions/detail";

export const mahasiswaAchievementColumns = (
    setOpenDeleteModal: (open: boolean) => void,
    setId: (id: number) => void,
    userId: number
): ColumnDef<MahasiswaAchievement>[] => [
    {
        accessorKey: "champion",
        header: "Juara",
        cell: ({ row }) => {
            switch (
                Number(row.original.user_to_competition.achievement?.champion)
            ) {
                case 1:
                    return (
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">
                            Juara 1
                        </Badge>
                    );

                case 2:
                    return (
                        <Badge className="bg-pink-500 hover:bg-pink-600">
                            Juara 2
                        </Badge>
                    );
                case 3:
                    return (
                        <Badge className="bg-purple-500 hover:bg-purple-600">
                            Juara 3
                        </Badge>
                    );
                case 4:
                    return (
                        <Badge className="bg-sky-500-500 hover:bg-sky-500-600">
                            Juara 4
                        </Badge>
                    );
                case 5:
                    return (
                        <Badge className="bg-green-500 hover:bg-green-600">
                            Juara 5
                        </Badge>
                    );
                default:
                    return (
                        <Badge className="bg-gray-300 hover:bg-gray-400">
                            Tidak Ada
                        </Badge>
                    );
            }
        }
    },
    {
        accessorKey: "mahasiswa.name",
        header: "Mahasiswa",
        cell: ({ row }) => (
            <div className="font-medium">{row.original.user.name}</div>
        )
    },
    {
        accessorKey: "competition.name",
        header: "Kompetisi",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {row.original.user_to_competition.competition.name}
            </div>
        )
    },
    {
        accessorKey: "name",
        header: "Nama Tim",
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.user_to_competition.name}
            </div>
        )
    },
    {
        accessorKey: "competition.author",
        header: "Penyelenggara",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {row.original.user_to_competition.competition.author}
            </div>
        )
    },
    {
        accessorKey: "registrant.name",
        header: "Ketua Tim",
        cell: ({ row }) => (
            <div>{row.original.user_to_competition.registrant.name}</div>
        )
    },
    {
        accessorKey: "dosen.name",
        header: "Dosen Pembimbing",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {row.original.user_to_competition.dosen.name}
            </div>
        )
    },
    {
        accessorKey: "competition.status",
        header: "Status Lomba",
        cell: ({ row }) => {
            const status = row.original.user_to_competition.competition.status;

            switch (status) {
                case "ongoing":
                    return (
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                            Berlangsung
                        </Badge>
                    );
                case "completed":
                    return (
                        <Badge className="bg-green-500 hover:bg-green-600">
                            Selesai
                        </Badge>
                    );
                case "canceled":
                    return <Badge variant="destructive">Dibatalkan</Badge>;
                default:
                    return null;
            }
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "competition.verified_status",
        header: "Verifikasi Lomba",
        cell: ({ row }) => {
            const status =
                row.original.user_to_competition.competition.verified_status;

            switch (status) {
                case "accepted":
                    return (
                        <Badge className="bg-green-500 hover:bg-green-600">
                            Diterima
                        </Badge>
                    );
                case "pending":
                    return (
                        <Badge
                            variant="outline"
                            className="text-yellow-600 border-yellow-600"
                        >
                            Menunggu
                        </Badge>
                    );
                case "rejected":
                    return <Badge variant="destructive">Ditolak</Badge>;
                default:
                    return null;
            }
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "user_to_competition.status",
        header: "Verifikasi Tim",
        cell: ({ row }) => {
            const status = row.original.user_to_competition.status;

            switch (status) {
                case "accepted":
                    return (
                        <Badge className="bg-green-500 hover:bg-green-600">
                            Diterima
                        </Badge>
                    );
                case "pending":
                    return (
                        <Badge
                            variant="outline"
                            className="text-yellow-600 border-yellow-600"
                        >
                            Menunggu
                        </Badge>
                    );
                case "rejected":
                    return <Badge variant="destructive">Ditolak</Badge>;
                default:
                    return null;
            }
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        }
    },
    {
        accessorKey: "created_at",
        header: "Tanggal Dibuat",
        cell: ({ row }) => {
            const date = new Date(row.original.user_to_competition.created_at);
            return (
                <div className="text-sm text-muted-foreground">
                    {date.toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                </div>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Buka menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.achievements.detail",
                                    row.original.user_to_competition.id
                                )}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Detail</span>
                            </Link>
                        </DropdownMenuItem>
                        {row.original.user_to_competition.status ==
                            "pending" && (
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route(
                                        "admin.teams.edit",
                                        row.original.id
                                    )}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </Link>
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        {row.original.user_to_competition?.achievement && (
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                    setId(
                                        row.original.user_to_competition
                                            .achievement?.id || 0
                                    );
                                    setOpenDeleteModal(true);
                                }}
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Hapus</span>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];

export type MahasiswaAchievement = {
    id: number;
    user_id: number;
    user: User;
    user_to_competition: UserToCompetition;
};

export type UserToCompetition = {
    id: number;
    name: string;
    registrant_id: number;
    dosen_id: number;
    competition_id: number;
    status: "pending" | "accepted" | "rejected";
    notes: string | null;
    created_at: string;
    updated_at: string;
    competition: Competition;
    registrant: User;
    dosen: User;
    achievement: Achievement | null;
};
