import { db } from "@opium/db";
import * as schema from "@opium/db/schema/auth";
import { sendEmail } from "@opium/email";
import { MagicLinkTemplate } from "@opium/email/templates";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, magicLink } from "better-auth/plugins";

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
		admin(),
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
