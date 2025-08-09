import { node } from "@elysiajs/node";
import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { RPCHandler } from "@orpc/server/fetch";
import { appRouter } from "./routes";
import { createContext } from "../core/context";
import { env } from "../config/env";
import { auth } from "../lib/auth";
import { Hono } from "hono";

const handler = new RPCHandler(appRouter);

export function buildServer() {
  const elysia = new Elysia()
    .use(
      cors({
        origin: env.CORS_ORIGIN,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
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

  const app = new Hono()
    .mount('/hono', elysia.fetch)

  return app;
}


