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

export const competitionColumns = (
    setOpenDeleteCompetitionModal: (open: boolean) => void,
    setCompetitionId: (id: number) => void
): ColumnDef<Competition>[] => [
    {
        accessorKey: "image",
        header: "Poster",
        cell: ({ row }) => (
            <div className="w-12 h-12 relative rounded-md overflow-hidden">
                <img
                    src={
                        row.getValue("image") ||
                        "/placeholder.svg?height=48&width=48"
                    }
                    alt={`Poster for ${row.getValue("name")}`}
                    className="object-cover"
                />
            </div>
        )
    },
    {
        accessorKey: "name",

        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("name")}</div>
        )
    },
    {
        accessorKey: "author",
        cell: ({ row }) => <div>{row.getValue("author")}</div>
    },
    {
        accessorKey: "level",
        cell: ({ row }) => {
            const level = row.getValue("level") as number;
            const colors = {
                1: "bg-gray-500 hover:bg-gray-600",
                2: "bg-blue-500 hover:bg-blue-600",
                3: "bg-green-500 hover:bg-green-600",
                4: "bg-orange-500 hover:bg-orange-600",
                5: "bg-purple-600 hover:bg-purple-700"
            };

            const levelNames = {
                1: "Internasional",
                2: "Nasional",
                3: "Regional",
                4: "Provinsi",
                5: "Universitas"
            };

            return (
                <Badge className={colors[level as keyof typeof colors]}>
                    {levelNames[level as keyof typeof levelNames]}
                </Badge>
            );
        }
    },
    {
        accessorKey: "start_date",
        cell: ({ row }) => (
            <div>
                {new Date(row.getValue("start_date")).toLocaleDateString()}
            </div>
        )
    },
    {
        accessorKey: "end_date",
        cell: ({ row }) => (
            <div>{new Date(row.getValue("end_date")).toLocaleDateString()}</div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;

            switch (status) {
                case "ongoing":
                    return (
                        <Badge className="bg-green-500 hover:bg-green-600">
                            Sedang Berlangsung
                        </Badge>
                    );
                case "completed":
                    return (
                        <Badge className="bg-blue-500 hover:bg-blue-600">
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
        accessorKey: "verified_status",
        header: "Verifikasi",
        cell: ({ row }) => {
            const status = row.getValue("verified_status") as string;

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
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Detail</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link
                                href={route(
                                    "admin.competitions.edit",
                                    row.original.id
                                )}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                                setCompetitionId(row.original.id);
                                setOpenDeleteCompetitionModal(true);
                            }}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Hapus</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];

export type Competition = {
    id: number;
    category_id: number;
    period_id: number;
    name: string;
    image: string;
    author: string;
    level: 1 | 2 | 3 | 4 | 5;
    start_date: string;
    end_date: string;
    description: string;
    status: "ongoing" | "completed" | "canceled";
    verified_status: "accepted" | "pending" | "rejected";
    notes?: string;
    created_at: string;
    updated_at: string;
};
