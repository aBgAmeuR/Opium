import type { RouterClient } from "@orpc/server";
import { adminRouter } from "./modules/admin/router";
import { artistRouter } from "./modules/artist/router";
import { imageRouter } from "./modules/image/router";
import { publicProcedure } from "./procedures";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => "OK"),
	admin: adminRouter,
	artist: artistRouter,
	image: imageRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
