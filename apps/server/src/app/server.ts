import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { RPCHandler } from "@orpc/server/fetch";
import { appRouter } from "./routes";
import { createContext } from "../lib/context";
import { env } from "../config/env";
import { logger } from "@bogeychan/elysia-logger";
import { auth } from "../lib/auth";

const handler = new RPCHandler(appRouter);

export function buildServer() {
  const app = new Elysia({ adapter: node() })
    .use(
      cors({
        origin: [env.CORS_ORIGIN, "http://localhost:3001", "http://127.0.0.1:3001", "http://localhost:3000", "http://127.0.0.1:3000", "http://tauri.host"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "X-Auth-Token-Test"],
      })
    )
    .use(
      logger({
        level: "error",
      })
    )
    .all("/api/auth/*", async (context) => {
      const { request } = context;
      if (["POST", "GET"].includes(request.method)) {
        return auth.handler(request);
      }
      context.error(405);
    })
    .all("/rpc*", async (context) => {
      const { response } = await handler.handle(context.request, {
        prefix: "/rpc",
        context: await createContext({ context }),
      });
      return response ?? new Response("Not Found", { status: 404 });
    })
    .get("/", () => "OK");

  return app;
}


