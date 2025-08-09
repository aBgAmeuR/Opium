import "dotenv/config";
import { buildServer } from "./app/server";
import { serve } from '@hono/node-server'
import { env } from "./config/env";

const app = buildServer();

serve({
  fetch: app.fetch,
  port: env.PORT,
})

export default app