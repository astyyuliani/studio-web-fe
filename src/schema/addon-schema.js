import { z } from "zod";

export const CreateAddonSchema = z.object({
  name: z
    .string({ required_error: "Nama tambahan tidak boleh kosong" })
    .min(3, "Nama tambahan minimal 3 karakter")
    .max(255, "Nama tambahan maksimal 255 karakter"),
  unit: z
    .string({ required_error: "Satuan tidak boleh kosong" })
    .min(1, "Satuan tidak boleh kosong")
    .max(255, "Satuan maksimal 255 karakter"),
  price: z.coerce
    .number({
      required_error: "Harga tidak boleh kosong",
    })
    .min(1000, "Harga minimal Rp1.000")
    .max(3000000, "Harga maksimal Rp3.000.000")
    .int()
    .positive("Harga harus positif"),
  categoryId: z.coerce
    .number({
      required_error: "ID Kategori tidak boleh kosong",
    })
    .min(1, "ID Kategori tidak boleh kosong")
    .int()
    .positive("ID Kategori harus positif"),
});

export const UpdateAddonSchema = z.object({
  name: z
    .string({ required_error: "Nama tambahan tidak boleh kosong" })
    .min(3, "Nama tambahan minimal 3 karakter")
    .max(255, "Nama tambahan maksimal 255 karakter"),
  unit: z
    .string({ required_error: "Satuan tidak boleh kosong" })
    .min(1, "Satuan tidak boleh kosong")
    .max(255, "Satuan maksimal 255 karakter"),
  price: z.coerce
    .number({
      required_error: "Harga tidak boleh kosong",
    })
    .min(1000, "Harga minimal Rp1.000")
    .max(3000000, "Harga maksimal Rp3.000.000")
    .int()
    .positive("Harga harus positif"),
  categoryId: z.coerce
    .number({
      required_error: "ID Kategori tidak boleh kosong",
    })
    .min(1, "ID Kategori tidak boleh kosong")
    .int()
    .positive("ID Kategori harus positif"),
});
