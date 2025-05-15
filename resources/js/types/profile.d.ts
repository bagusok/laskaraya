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
}

export interface ProfileFormData {
    name: string;
    email: string;
    identifier: string;
    phone: string;
    faculty: string;
    role: string;
    is_verified: boolean;
    password: string | undefined;
    password_confirmation: string | undefined;
    current_password: string | undefined;
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
        .or(z.literal(""))
});

export type ProfileFormData = z.infer<typeof profileSchema>;
