import { ORPCError } from "@orpc/client";
import { os } from "@orpc/server";
import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}
	return next({
		context: {
			session: context.session,
		},
	});
});

export const protectedProcedure = publicProcedure.use(requireAuth);

const requireAdmin = o.middleware(({ context, next }) => {
	if (!context.session?.user) {
		throw new ORPCError("UNAUTHORIZED");
	}

	// TODO: Add admin role check
	// @ts-expect-error - user is not typed correctly (Better Auth)
	if (context.session.user.role !== "admin") {
		throw new ORPCError("FORBIDDEN", {
			message: "Admin access required",
		});
	}

	return next({
		context: {
			session: context.session,
		},
	});
});

export const adminProcedure = protectedProcedure.use(requireAdmin);
