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
    total_competitions?: number;
    total_wins?: number;
    created_at: string;
    updated_at: string;
}

export interface MahasiswaProfile {
    id: number;
    user_id: number;
    prodi_id: number;
    faculty: string | null;
    major: string | null;
    created_at: string;
    updated_at: string;
    total_competitions?: number;
    total_wins?: number;
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
    mahasiswa?: MahasiswaProfile;
    prodi?: {
        id: number;
        nama: string;
    };
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
    prodi_id?: number;
    skills?: { id: number; level: number }[];
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
    birth_date: z.string().optional(),
    prodi_id: z.number().optional(),
    skills: z
        .array(
            z.object({
                id: z.number(),
                level: z.number().min(1).max(5)
            })
        )
        .optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;
