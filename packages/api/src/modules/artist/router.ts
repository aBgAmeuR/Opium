import { adminProcedure } from "../../procedures";
import { artistService } from "./service";
import { createArtistSchema } from "./validation";

export const artistRouter = {
	create: adminProcedure
		.input(createArtistSchema)
		.handler(async ({ input }) => await artistService.create(input)),

	list: adminProcedure.handler(async () => await artistService.list()),
};
