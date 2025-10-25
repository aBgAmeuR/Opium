import { db } from "@opium/db";
// biome-ignore lint/performance/noNamespaceImport: drizzle schema
import * as schema from "@opium/db/schema/auth";
import { sendEmail } from "@opium/email";
import { MagicLinkTemplate } from "@opium/email/templates";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth<BetterAuthOptions>({
  database: drizzleAdapter(db, {
    provider: "pg",

    schema,
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        await sendEmail({
          to: email,
          subject: "Magic Link",
          template: MagicLinkTemplate({ email, token, url }),
        });
      },
    }),
  ],
  trustedOrigins: [process.env.CORS_ORIGIN || ""],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
});
