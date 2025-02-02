import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    GOOGLE_SITE_VERIFICATION_ID: z.string().min(1).optional(),
    APP_URL: z.string().url().min(1),
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    DEVELOPMENT: z.boolean(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().min(1),
    NEXT_PUBLIC_DEVELOPMENT: z.boolean(),
  },
  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    GOOGLE_SITE_VERIFICATION_ID: process.env.GOOGLE_SITE_VERIFICATION_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_DEVELOPMENT: process.env.NODE_ENV === 'development',
    DEVELOPMENT: process.env.NODE_ENV === 'development',
  },
});
