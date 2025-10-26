import { z } from "zod";

export const uploadImageInputSchema = z.object({
	file: z.instanceof(File),
	prefix: z.string().optional(),
	fileName: z.string().optional(),
});
export type UploadImageInput = z.infer<typeof uploadImageInputSchema>;

export const uploadImageOutputSchema = z.object({
	url: z.string(),
});
export type UploadImageOutput = z.infer<typeof uploadImageOutputSchema>;
