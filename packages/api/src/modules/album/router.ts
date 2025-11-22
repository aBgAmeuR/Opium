import {
	adminProcedure,
	protectedProcedure,
	publicProcedure,
} from "../../procedures";
import { albumService } from "./service";
import {
	createAlbumSchema,
	getAlbumSchema,
	toggleLikeSchema,
} from "./validation";

export const albumRouter = {
	create: adminProcedure
		.input(createAlbumSchema)
		.handler(async ({ input }) => await albumService.create(input)),

	list: publicProcedure.handler(async () => await albumService.list()),

	getById: publicProcedure
		.input(getAlbumSchema)
		.handler(async ({ input, context }) => await albumService.getById(input.id, context.session?.user.id)),

	getSongs: publicProcedure
		.input(getAlbumSchema)
		.handler(async ({ input }) => await albumService.getSongs(input.id)),

	toggleLike: protectedProcedure
		.input(toggleLikeSchema)
		.handler(
			async ({ input, context }) =>
				await albumService.toggleLike(context.session.user.id, input.albumId),
		),
};
