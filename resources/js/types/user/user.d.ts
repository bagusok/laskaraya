import { ReactNode } from "react";

export interface User {
    id?: number;
    name: string;
    email: string;
    identifier: string;
    phone: string;
    faculty: string;
    password?: string;
    role: string;
    is_verified: boolean;
    created_at?: string;
    updated_at?: string;
    prodi_id?: number;
}

export interface Column {
    header: string;
    accessorKey: string;
    cell?: (row: User) => ReactNode;
}
