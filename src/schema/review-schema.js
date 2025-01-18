import { z } from "zod";

export const CreateReviewSchema = z.object({
  rating: z
    .number({ required_error: "Rating tidak boleh kosong" })
    .min(1, "Rating harus dipilih")
    .max(5, "Rating maksimal 5")
    .int()
    .positive("ID Reservasi harus positif"),
  review: z
    .string({ required_error: "Review tidak boleh kosong" })
    .min(1, "Review minimal 1 karakter")
    .max(1000, "Review maksimal 1000 karakter"),
});
