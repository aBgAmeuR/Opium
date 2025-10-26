import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/middleware/auth";

export const getUser = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(({ context }) => context.session);

export const isAdmin = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(({ context }) => context.session?.user?.role === "admin");
