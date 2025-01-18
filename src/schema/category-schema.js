import { z } from "zod";

export const CreateCategorySchema = z.object({
  name: z
    .string({ required_error: "Nama kategori tidak boleh kosong" })
    .min(3, "Nama minimal 3 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  deskripsi: z
    .string({ required_error: "Deskripsi kategori tidak boleh kosong" })
    .min(3, "Nama minimal 3 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  images: z.instanceof(FileList, "Gambar tidak boleh kosong"),
});

export const UpdateCategorySchema = z.object({
  name: z
    .string({ required_error: "Nama kategori tidak boleh kosong" })
    .min(3, "Nama minimal 3 karakter")
    .max(255, "Nama maksimal 255 karakter"),
  deskripsi: z
    .string({ required_error: "Deskripsi kategori tidak boleh kosong" })
    .min(3, "Nama minimal 3 karakter")
    .max(255, "Nama maksimal 255 karakter"),

  images_url: z.array(z.string(), {
    required_error: "Gambar tidak boleh kosong",
  }),
  images: z.any(),
});
