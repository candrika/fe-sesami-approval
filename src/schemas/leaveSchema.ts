import { z } from "zod";

export const leaveSchema = z.object({
  title: z.string().min(3, "Judul wajib diisi"),
  description: z.string().min(5, "Deskripsi wajib diisi"),
});

export type LeaveSchemaType = z.infer<typeof leaveSchema>;
