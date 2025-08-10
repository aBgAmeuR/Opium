import type { Context as ElysiaContext } from "elysia";
import { auth } from "./auth";
// import { db } from "@/db";
// import { createLogger } from "@/lib/logger";
// import { randomUUID } from "node:crypto";

export type CreateContextOptions = {
  context: ElysiaContext;
};

export async function createContext({ context }: CreateContextOptions) {
  const session = await auth.api.getSession({ headers: context.request.headers });
  return {
      session,
      // db,
      // logger: createLogger("rpc"),
      // requestId: randomUUID(),
      // ip: context.request.headers.get("x-forwarded-for") ?? undefined,
      // userAgent: context.request.headers.get("user-agent") ?? undefined,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
