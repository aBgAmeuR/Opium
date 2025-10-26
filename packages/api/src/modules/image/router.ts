import { protectedProcedure } from "../../procedures";
import { imageService } from "./service";
import { uploadImageInputSchema, uploadImageOutputSchema } from "./validation";

export const imageRouter = {
	upload: protectedProcedure
		.input(uploadImageInputSchema)
		.output(uploadImageOutputSchema)
		.handler(async ({ input }) =>
			imageService.upload(input.file, {
				prefix: input.prefix ?? "images",
				fileName: input.fileName,
			}),
		),
};
