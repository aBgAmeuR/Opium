import { publicProcedure, protectedProcedure } from "../lib/orpc";
import { tracksRouter } from "../modules/tracks/router";
import { albumsRouter } from "../modules/albums/router";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => "OK"),
  privateData: protectedProcedure.handler(({ context }) => ({
    message: "This is private",
    user: context.session?.user,
  })),
  // Modules
  tracks: tracksRouter,
  albums: albumsRouter,
};

export type AppRouter = typeof appRouter;


