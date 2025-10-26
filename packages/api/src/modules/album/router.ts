import { adminProcedure } from "../../procedures";
import { albumService } from "./service";
import { createAlbumSchema } from "./validation";

export const albumRouter = {
	create: adminProcedure
		.input(createAlbumSchema)
		.handler(async ({ input }) => await albumService.create(input)),

	list: adminProcedure.handler(async () => await albumService.list()),
};
