import { protectedProcedure, publicProcedure } from "../../procedures";
import { libraryService } from "./service";

export const libraryRouter = {
	getLibrary: publicProcedure.handler(async ({ context }) => {
		const userId = context.session?.user?.id;
		if (!userId) return [] as Awaited<ReturnType<typeof libraryService.getLibrary>>;
		return await libraryService.getLibrary(userId);
	}),
};
