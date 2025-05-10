import { User } from "@/types/user/user";
import { ColumnDef } from "@tanstack/react-table";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";

export type UserTableProps = {
    data?: User[];
    columns?: ColumnDef<User>[];
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
    baseRoute?: string;
    selectable?: boolean;
    onSelectionChange?: (selectedUsers: User[]) => void;
};

export const handleEdit = (
    user: User,
    onEdit?: (user: User) => void,
    baseRoute: string = "users"
) => {
    if (onEdit) {
        onEdit(user);
    } else {
        router.visit(route(`${baseRoute}.edit`, { user: user.id }));
    }
};

export const handleDelete = (
    user: User,
    onDelete?: (user: User) => void,
    baseRoute: string = "users"
) => {
    if (onDelete) {
        onDelete(user);
    } else {
        if (confirm(`Apakah Anda yakin ingin menghapus ${user.name}?`)) {
            router.delete(route(`${baseRoute}.destroy`, { user: user.id }));
        }
    }
};

export const createTableColumns = (
    columns: ColumnDef<User>[],
    selectable: boolean,
    onEdit?: (user: User) => void,
    onDelete?: (user: User) => void,
    baseRoute: string = "users"
) => {
    const columnsWithSelection: ColumnDef<User>[] = selectable
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

    const actionColumn: ColumnDef<User> = {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex gap-2">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(user, onEdit, baseRoute)}
                        className="hover:bg-purple-100/30 hover:text-purple-600"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(user, onDelete, baseRoute)}
                        className="hover:bg-red-100/30 hover:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        }
    };

    return [...columnsWithSelection, ...columns, actionColumn];
};
