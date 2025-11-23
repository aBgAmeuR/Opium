import { adminProcedure, protectedProcedure, publicProcedure } from "../../procedures";
import { songService } from "./service";
import { createSongSchema, getLatestSongSchema, toggleLikeSchema } from "./validation";

export const songRouter = {
	create: adminProcedure
		.input(createSongSchema)
		.handler(async ({ input }) => await songService.create(input)),

	list: adminProcedure.handler(async () => await songService.list()),

	getLatest: publicProcedure
		.input(getLatestSongSchema)
		.handler(async ({ input }) => await songService.getLatest(input.limit)),

	toggleLike: protectedProcedure
		.input(toggleLikeSchema)
		.handler(
			async ({ input, context }) =>
				await songService.toggleLike(context.session.user.id, input.songId),
		),
};
