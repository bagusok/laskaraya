import { LucideIcon } from "lucide-react";
import type { Config } from "ziggy-js";

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    identifier: string;
    email: string;
    phone: string;
    role: Role;
    created_at: Date | string;
    updated_at: Date | string;
    mahasiswa?: MahasiswaProfile;
    dosen?: DosenProfile;
}

export interface PaginationProps {
    current_page: number;
    last_page: number;
    per_page: number;
    total_page: number;
    total_data: number;
}

export interface MahasiswaProfile {
    id: number;
    user_id: number;
    address: string;
    year: number;
    faculty: string;
    major: string;
    gender: "L" | "P";
    birth_date: Date | string;
    birth_place: string;
    total_competitions?: number;
    total_wins?: number;
}

export interface DosenProfile {
    id: number;
    user_id: number;
    address: string;
    faculty: string;
    major: string;
    gender: "L" | "P";
    birth_date: Date | string;
    birth_place: string;
}

export enum Role {
    MAHASISWA = "mahasiswa",
    ADMIN = "admin",
    DOSEN = "dosen"
}
