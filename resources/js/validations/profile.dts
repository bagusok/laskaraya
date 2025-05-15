import * as z from "zod";

export const profileSchema = z.object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid"),
    identifier: z.string().min(5, "Identifier minimal 5 karakter"),
    phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
    faculty: z.string().min(2, "Fakultas harus diisi"),
    role: z.string(),
    is_verified: z.boolean()
});
