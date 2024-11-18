import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    GOOGLE_SITE_VERIFICATION_ID: z.string().min(1).optional(),
    APP_URL: z.string().url().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().min(1),
  },
  runtimeEnv: {
    APP_URL: process.env.APP_URL,
    GOOGLE_SITE_VERIFICATION_ID: process.env.GOOGLE_SITE_VERIFICATION_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
});
