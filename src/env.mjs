import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    GOOGLE_SITE_VERIFICATION_ID: z.string().min(1).optional(),
    APP_URL: z.string().url().min(1),
  },
});
