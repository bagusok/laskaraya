import { z } from "zod";

export type UserRole = "admin" | "dosen" | "mahasiswa";

export interface User {
    name?: string;
    email?: string;
    identifier?: string;
    phone?: string;
    faculty?: string;
    role?: UserRole;
    is_verified?: boolean;
    profile_picture?: string;
    profile_picture_url?: string;
}

export interface ProfileFormData {
    name: string;
    email: string;
    identifier: string;
    phone: string;
    faculty: string | null;
    role: UserRole;
    is_verified: boolean;
    password?: string;
    profile_picture?: FileList;
}

export const profileSchema = z.object({
    name: z.string().min(1, "Nama harus diisi"),
    email: z.string().email("Email tidak valid"),
    identifier: z.string().min(1, "Identifier harus diisi"),
    phone: z.string().min(1, "Nomor telepon harus diisi"),
    faculty: z.string().nullable(),
    role: z.enum(["admin", "dosen", "mahasiswa"] as const),
    is_verified: z.boolean(),
    password: z
        .string()
        .min(8, "Password minimal 8 karakter")
        .optional()
        .or(z.literal("")),
    profile_picture: z.any().optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;
