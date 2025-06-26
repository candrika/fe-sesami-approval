import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  roles: z.enum(["User", "Verifikator"]),
});

export type UserSchemaType = z.infer<typeof userSchema>;