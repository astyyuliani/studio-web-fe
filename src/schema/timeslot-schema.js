import { z } from "zod";

export const CreateTimeSlotSchema = z.object({
  time: z
    .string({ required_error: "Waktu tidak boleh kosong" })
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      "Waktu harus dalam format HH:mm (contoh, 11:00)",
    )
    .refine(
      (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes;
        const minTime = 10 * 60 + 20; // 10:20 in minutes
        const maxTime = 19 * 60 + 40; // 19:40 in minutes
        return totalMinutes >= minTime && totalMinutes <= maxTime;
      },
      { message: "Waktu harus diantara 10:20 dan 19:40" },
    )
    .refine(
      (time) => {
        const minutes = Number(time.split(":")[1]);
        return [0, 20, 40].includes(minutes);
      },
      {
        message: "Waktu harus berjarak 20 menit (contoh, 10:00, 10:20; 10:40)",
      },
    ),
});
