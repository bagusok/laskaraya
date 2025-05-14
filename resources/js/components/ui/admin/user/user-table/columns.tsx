import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import EditUserModal from "../editUserModal";
import { Trash2 } from "lucide-react";
import DelUserModal from "../delUserModal";

export const userDataTableColumns = (): ColumnDef<User>[] => [
    {
        header: "Nama",
        accessorKey: "name"
    },
    {
        header: "Email",
        accessorKey: "email"
    },
    {
        header: "NIM/NIP",
        accessorKey: "identifier"
    },
    {
        header: "No. Telepon",
        accessorKey: "phone"
    },
    {
        header: "Jurusan",
        accessorKey: "faculty",
        cell: ({ row }) => (
            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                {row.getValue("role") == "mahasiswa"
                    ? (row.original?.mahasiswa?.faculty ??
                      "Belum Mengisi Profil")
                    : (row.original?.dosen?.faculty ?? "Belum Mengisi Profil")}
            </span>
        )
    },
    {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => (
            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                {row.getValue("role")}
            </span>
        )
    },
    {
        header: "Action",
        accessorKey: "action",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <EditUserModal userId={row.original.id} />

                <DelUserModal
                    userId={row.original.id}
                    userName={row.original.name}
                />
            </div>
        )
    }
];
