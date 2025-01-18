import { z } from "zod";

export const RegisterSchema = z.object({
  name: z
    .string({ required_error: "Nama tidak boleh kosong" })
    .min(3, "Nama minimal 3 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  email: z
    .string({ required_error: "Email tidak boleh kosong" })
    .email("Email tidak valid"),
  phone: z
    .string({ required_error: "Nomor telepon tidak boleh kosong" })
    .min(12, "Nomor telepon minimal 12 karakter")
    .max(20, "Nomor telepon maksimal 20 karakter"),
  password: z
    .string({ required_error: "Password tidak boleh kosong" })
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
});

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email tidak boleh kosong" })
    .email("Email tidak valid"),
  password: z
    .string({ required_error: "Password tidak boleh kosong" })
    .min(6, "Password minimal 6 karakter")
    .max(100, "Password maksimal 100 karakter"),
});
