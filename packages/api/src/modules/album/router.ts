import { adminProcedure, protectedProcedure } from "../../procedures";
import { albumService } from "./service";
import { createAlbumSchema, getAlbumSchema } from "./validation";

export const albumRouter = {
	create: adminProcedure
		.input(createAlbumSchema)
		.handler(async ({ input }) => await albumService.create(input)),

	list: adminProcedure.handler(async () => await albumService.list()),

	getById: protectedProcedure
		.input(getAlbumSchema)
		.handler(async ({ input }) => await albumService.getById(input.id)),
};
