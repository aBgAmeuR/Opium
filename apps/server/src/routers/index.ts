import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { tracksRouter } from "./tracks";
import { albumsRouter } from "./albums";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  tracks: tracksRouter,
  albums: albumsRouter,
};
export type AppRouter = typeof appRouter;
