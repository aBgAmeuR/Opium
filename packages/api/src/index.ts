import type { RouterClient } from "@orpc/server";
import { adminRouter } from "./modules/admin/router";
import { albumRouter } from "./modules/album/router";
import { artistRouter } from "./modules/artist/router";
import { imageRouter } from "./modules/image/router";
import { playlistRouter } from "./modules/playlist/router";
import { songRouter } from "./modules/song/router";
import { publicProcedure } from "./procedures";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => "OK"),
	admin: adminRouter,
	artist: artistRouter,
	album: albumRouter,
	song: songRouter,
	image: imageRouter,
	playlist: playlistRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
