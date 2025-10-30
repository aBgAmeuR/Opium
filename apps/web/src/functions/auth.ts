import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";

export const getUserFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(({ context }) => context.session);

export const isAdminFn = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(({ context }) => context.session?.user?.role === "admin");
