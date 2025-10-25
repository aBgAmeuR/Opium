import "dotenv/config";
import { createContext } from "@opium/api/context";
import { appRouter } from "@opium/api/routers/index";
import { auth } from "@opium/auth";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Elysia } from "elysia";

const HTTP_STATUS_CODES = {
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  UNPROCESSABLE_ENTITY: 422,
} as const;

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

const apiHandler = new OpenAPIHandler(appRouter, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export const app = new Elysia({ prefix: "/api" })
  .all("/auth/*", (context) => {
    const { request, status } = context;
    if (["POST", "GET"].includes(request.method)) {
      return auth.handler(request);
    }
    return status(HTTP_STATUS_CODES.METHOD_NOT_ALLOWED);
  })
  .all("/rpc*", async (context) => {
    const { response } = await rpcHandler.handle(context.request, {
      prefix: "/api/rpc",
      context: await createContext({ context }),
    });
    return (
      response ??
      new Response("Not Found", { status: HTTP_STATUS_CODES.NOT_FOUND })
    );
  })
  .get("/health", () => "OK")
  .all("/*", async (context) => {
    const { response } = await apiHandler.handle(context.request, {
      prefix: "/api-reference",
      context: await createContext({ context }),
    });
    return (
      response ??
      new Response("Not Found", { status: HTTP_STATUS_CODES.NOT_FOUND })
    );
  });
