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
import { Checkbox } from "@/components/ui/checkbox";

export const createCompetitionTableColumns = (
    columns: ColumnDef<Competition>[],
    selectable: boolean,
    setOpenDeleteCompetitionModal: (open: boolean) => void,
    setCompetitionId: (id: number) => void
): ColumnDef<Competition>[] => {
    const columnsWithSelection: ColumnDef<Competition>[] = selectable
        ? [
              {
                  id: "select",
                  header: ({ table }) => (
                      <Checkbox
                          checked={table.getIsAllPageRowsSelected()}
                          onCheckedChange={(value: boolean) =>
                              table.toggleAllPageRowsSelected(!!value)
                          }
                          aria-label="Pilih semua"
                          className="translate-y-[2px]"
                      />
                  ),
                  cell: ({ row }) => (
                      <Checkbox
                          checked={row.getIsSelected()}
                          onCheckedChange={(value: boolean) =>
                              row.toggleSelected(!!value)
                          }
                          aria-label="Pilih baris"
                          className="translate-y-[2px]"
                      />
                  ),
                  enableSorting: false,
                  enableHiding: false
              }
          ]
        : [];
    const actionColumn: ColumnDef<Competition> = {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const comp = row.original;
            return (
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        asChild
                        className="rounded shadow-sm border border-purple-200 p-2 hover:bg-white hover:text-purple-700 transition-all duration-150"
                    >
                        <Link href={route("admin.competitions.edit", comp.id)}>
                            <Edit className="h-5 w-5" />
                        </Link>
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                            setCompetitionId(comp.id);
                            setOpenDeleteCompetitionModal(true);
                        }}
                        className="rounded shadow-sm border border-red-200 p-2 hover:bg-white hover:text-red-600 transition-all duration-150"
                    >
                        <Trash className="h-5 w-5" />
                    </Button>
                </div>
            );
        }
    };
    return [...columnsWithSelection, ...columns, actionColumn];
};

export const competitionColumns = (
    setOpenDeleteCompetitionModal: (open: boolean) => void,
    setCompetitionId: (id: number) => void
): ColumnDef<Competition>[] => {
    const baseColumns: ColumnDef<Competition>[] = [
        {
            accessorKey: "image",
            header: () => (
                <span className="uppercase text-xs tracking-wider text-gray-700">
                    Poster
                </span>
            ),
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
            header: () => (
                <span className="uppercase text-xs tracking-wider text-gray-700">
                    Nama
                </span>
            ),
            cell: ({ row }) => (
                <div className="font-medium text-gray-900">
                    {row.getValue("name")}
                </div>
            )
        },
        {
            accessorKey: "status",
            header: () => (
                <span className="uppercase text-xs tracking-wider text-gray-700">
                    Status
                </span>
            ),
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
            }
        },
        {
            accessorKey: "start_date",
            header: () => (
                <span className="uppercase text-xs tracking-wider text-gray-700">
                    Tanggal Mulai
                </span>
            ),
            cell: ({ row }) => (
                <div>
                    {new Date(row.getValue("start_date")).toLocaleDateString()}
                </div>
            )
        },
        {
            accessorKey: "end_date",
            header: () => (
                <span className="uppercase text-xs tracking-wider text-gray-700">
                    Tanggal Selesai
                </span>
            ),
            cell: ({ row }) => (
                <div>
                    {new Date(row.getValue("end_date")).toLocaleDateString()}
                </div>
            )
        }
    ];
    return createCompetitionTableColumns(
        baseColumns,
        false,
        setOpenDeleteCompetitionModal,
        setCompetitionId
    );
};

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
    uploader_id: number;
    created_at: string;
    updated_at: string;
};
