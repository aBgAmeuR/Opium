import { adminProcedure } from "../../procedures";
import { songService } from "./service";
import { createSongSchema } from "./validation";

export const songRouter = {
	create: adminProcedure
		.input(createSongSchema)
		.handler(async ({ input }) => await songService.create(input)),

	list: adminProcedure.handler(async () => await songService.list()),
};
