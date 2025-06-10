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
import {
    Edit,
    Eye,
    Medal,
    MoreHorizontal,
    Notebook,
    Trash
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { User } from "@/types";
import { Competition } from "../competition-table/columns";

export const teamColumns = (
    setOpenDeleteTeamModal: (open: boolean) => void,
    setTeamId: (id: number) => void,
    userId: number
): ColumnDef<Team>[] => [
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
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {row.original.competition.name}
            </div>
        )
    },
    {
        accessorKey: "competition.author",
        header: "Penyelenggara",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {row.original.competition.author}
            </div>
        )
    },
    {
        accessorKey: "registrant.name",
        header: "Ketua Tim",
        cell: ({ row }) => <div>{row.original.registrant.name}</div>
    },
    {
        accessorKey: "dosen.name",
        header: "Dosen Pembimbing",
        cell: ({ row }) => (
            <div className="text-sm text-muted-foreground">
                {row.original.dosen.name}
            </div>
        )
    },
    {
        accessorKey: "competition.status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.competition.status;

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
            const status = row.original.competition.verified_status;

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
        accessorKey: "status",
        header: "Verifikasi Tim",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

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
            const date = new Date(row.getValue("created_at"));
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
                                    "mahasiswa.teams.detail",
                                    row.original.id
                                )}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Detail</span>
                            </Link>
                        </DropdownMenuItem>
                        {row.getValue("status") == "pending" && (
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route(
                                        "mahasiswa.teams.edit",
                                        row.original.id
                                    )}
                                >
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </Link>
                            </DropdownMenuItem>
                        )}

                        {row.original.status == "accepted" && (
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route(
                                        "mahasiswa.teams.achievement.create",
                                        row.original.id
                                    )}
                                >
                                    <Medal className="mr-2 h-4 w-4" />
                                    <span>Isi Prestasi</span>
                                </Link>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {row.getValue("status") == "pending" &&
                            userId == row.original.registrant_id && (
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                        setTeamId(row.original.id);
                                        setOpenDeleteTeamModal(true);
                                    }}
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    <span>Hapus</span>
                                </DropdownMenuItem>
                            )}
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "mahasiswa.teams.logs",
                                    row.original.id
                                )}
                            >
                                <Notebook className="mr-2 h-4 w-4" />
                                <span>Log Harian</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];

export type Team = {
    id: number;
    name: string;
    dosen_id: number;
    registrant_id: number;
    status: "pending" | "accepted" | "rejected";
    dosen: User;
    registrant: User;
    competition: Competition;
    created_at: string;
    updated_at: string;
    members: User[];
};
