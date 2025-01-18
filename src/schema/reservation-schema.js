import { z } from "zod";

export const CreateReservationSchema = z.object({
  date: z
    .string({ required_error: "Tanggal tidak boleh kosong" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal tidak valid",
    }),
  timeId: z.coerce
    .number({ required_error: "Harus memilih salah satu waktu" })
    .min(1, "Harus memilih salah satu waktu")
    .int()
    .positive("Harus memilih salah satu waktu"),
  categoryId: z.coerce
    .number({ required_error: "ID Kategori tidak boleh kosong" })
    .min(1, "ID Kategori tidak boleh kosong")
    .int()
    .positive("ID Kategori harus positif"),
  categoryPackageId: z.coerce
    .number({ required_error: "ID Paket tidak boleh kosong" })
    .min(1, "ID Paket tidak boleh kosong")
    .int()
    .positive("ID Paket harus positif"),
  addons: z
    .array(
      z.object({
        id: z.coerce
          .number({ required_error: "ID Tambahan tidak boleh kosong" })
          .int()
          .positive("ID Tambahan harus positif")
          .optional(),
        quantity: z.coerce
          .number({ required_error: "Jumlah tambahan tidak boleh kosong" })
          .min(1, "Jumlah tambahan minimal 1")
          .max(10, "Jumlah tambahan maksimal 10")
          .int()
          .positive("Jumlah tambahan harus positif")
          .optional(),
      }),
      { required_error: "Tambahan tidak boleh kosong" },
    )
    .optional(),
  type: z.enum(["downpayment", "fullpayment"], {
    required_error: "Metode transaksi tidak boleh kosong",
  }),
});
