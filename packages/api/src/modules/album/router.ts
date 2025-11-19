import { adminProcedure, publicProcedure } from "../../procedures";
import { albumService } from "./service";
import { createAlbumSchema, getAlbumSchema } from "./validation";

export const albumRouter = {
	create: adminProcedure
		.input(createAlbumSchema)
		.handler(async ({ input }) => await albumService.create(input)),

	list: publicProcedure.handler(async () => await albumService.list()),

	getById: publicProcedure
		.input(getAlbumSchema)
		.handler(async ({ input }) => await albumService.getById(input.id)),

	getSongs: publicProcedure
		.input(getAlbumSchema)
		.handler(async ({ input }) => await albumService.getSongs(input.id)),
};
