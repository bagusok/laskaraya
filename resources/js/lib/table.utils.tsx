import { User } from "@/types/user/user";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export const createActionColumn = (
    onEdit?: (user: User) => void,
    onDelete?: (user: User) => void,
    baseRoute: string = "users"
): ColumnDef<User> => ({
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
        const user = row.original;
        return (
            <div className="flex gap-2">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit?.(user)}
                    className="hover:bg-purple-100/30 hover:text-purple-600"
                >
                    <i className="text-blue-500">
                        <svg width="16" height="16">
                            <path d="M2 12.5V14h1.5l8.1-8.1-1.5-1.5L2 12.5z" />
                        </svg>
                    </i>
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete?.(user)}
                    className="hover:bg-red-100/30 hover:text-red-600"
                >
                    <i className="text-red-500">
                        <svg width="16" height="16">
                            <path d="M6 19c0 1.1.9 2 2 2s2-.9 2-2H6zm6.3-3.71l1.42 1.42C13.9 17.9 13.7 18 13.5 18h-11c-.2 0-.4-.1-.5-.29l1.42-1.42C4.1 14.9 5.05 14 6.5 14h3c1.45 0 2.4.9 2.8 1.29z" />
                        </svg>
                    </i>
                </Button>
            </div>
        );
    }
});

export const createSelectionColumn = (): ColumnDef<User> => ({
    id: "select",
    header: ({ table }) => (
        <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Pilih semua"
            className="translate-y-[2px]"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Pilih baris"
            className="translate-y-[2px]"
        />
    ),
    enableSorting: false,
    enableHiding: false
});
