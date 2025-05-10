import React from "react";
import { User } from "@/types/user/user";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
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
        accessorKey: "faculty"
    },
    {
        header: "Role",
        accessorKey: "role",
        cell: ({ row }) => (
            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">
                {row.getValue("role")}
            </span>
        )
    }
];

export const users: User[] = [
    {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        identifier: "1234567890",
        phone: "081234567890",
        faculty: "Fakultas Teknik",
        role: "Admin",
        is_verified: true,
        created_at: "2024-01-01",
        updated_at: "2024-01-01"
    }
];
