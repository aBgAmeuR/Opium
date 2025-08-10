import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";
import { env } from "@/config/env";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuthMiddleware = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({ context: context });
});

export const protectedProcedure = publicProcedure.use(requireAuthMiddleware);

const adminEmails = new Set(
  (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

export const requireAdmin = o.middleware(async ({ context, next }) => {
  const email = context.session?.user?.email;
  if (!email || !adminEmails.has(email)) {
    throw new ORPCError("");
  }
  return next({ context: context });
});

export const adminProcedure = protectedProcedure.use(requireAdmin);
