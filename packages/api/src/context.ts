import { auth } from "@opium/auth";
import type { Context as ElysiaContext } from "elysia";

export type CreateContextOptions = {
	context: ElysiaContext;
};

export async function createContext({ context }: CreateContextOptions) {
	const headers =
		context?.request?.headers instanceof Headers
			? context.request.headers
			: new Headers();

	const session = await auth.api.getSession({ headers });

	return {
		session,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
