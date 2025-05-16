import { z } from "zod";

export type UserRole = "admin" | "dosen" | "mahasiswa";

export interface DosenProfile {
    id: number;
    user_id: number;
    address: string | null;
    faculty: string | null;
    major: string | null;
    gender: "L" | "P" | null;
    birth_place: string | null;
    birth_date: string | null;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    identifier: string;
    phone: string;
    role: UserRole;
    is_verified: boolean;
    image: string | null;
    image_url: string;
    created_at: string;
    updated_at: string;
    dosen?: DosenProfile;
}

export interface ProfileFormData {
    name: string;
    email: string;
    identifier: string;
    phone: string;
    role: UserRole;
    is_verified: boolean;
    password?: string;
    image?: FileList;
    address?: string;
    faculty?: string;
    major?: string;
    gender?: "L" | "P";
    birth_place?: string;
    birth_date?: string;
}

export const profileSchema = z.object({
    name: z.string().min(1, "Nama harus diisi"),
    email: z.string().email("Email tidak valid"),
    identifier: z.string().min(1, "Identifier harus diisi"),
    phone: z.string().min(1, "Nomor telepon harus diisi"),
    role: z.enum(["admin", "dosen", "mahasiswa"]),
    is_verified: z.boolean(),
    password: z
        .string()
        .min(8, "Password minimal 8 karakter")
        .or(z.literal(""))
        .optional(),
    image: z.any().optional(),
    address: z.string().optional(),
    faculty: z.string().optional(),
    major: z.string().optional(),
    gender: z.enum(["L", "P"]).optional(),
    birth_place: z.string().optional(),
    birth_date: z.string().optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;
