import prisma from "@opium/db";
import { sendEmail } from "@opium/email";
import { MagicLinkTemplate } from "@opium/email/templates";
import { type Auth, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";

export const auth: Auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
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
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
});
