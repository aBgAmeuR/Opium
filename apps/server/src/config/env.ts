import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z
    .string()
    .default("3000")
    .transform((v) => Number(v))
    .pipe(z.number().int().positive()),
  CORS_ORIGIN: z.string().default(process.env.NODE_ENV === "development" ? "http://localhost:3001, http://127.0.0.1:3001" : ""),
  DATABASE_URL: z.string().default(""),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().optional(),
  ADMIN_EMAILS: z.string().optional(), // comma-separated list
});

export const env = EnvSchema.parse(process.env);


