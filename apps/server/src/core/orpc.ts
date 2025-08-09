import { ORPCError, os } from "@orpc/server";
import type { Context } from "./context";
import { env } from "../config/env";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuthMiddleware = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next();
});

export const protectedProcedure = publicProcedure.use(requireAuthMiddleware);

export const requireRole = (role: string) =>
  o.middleware(async ({ context, next }) => {
    const currentRole = (context.session as any)?.user?.role ?? "user";
    if (currentRole !== role) {
      throw new ORPCError("FORBIDDEN");
    }
    return next();
  });

const adminEmails = new Set(
  (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

export const requireAdmin = o.middleware(async ({ context, next }) => {
  const email = (context.session as any)?.user?.email as string | undefined;
  if (!email || !adminEmails.has(email)) {
    throw new ORPCError("FORBIDDEN");
  }
  return next();
});

export const adminProcedure = protectedProcedure.use(requireAdmin);


