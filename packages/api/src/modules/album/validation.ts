import { z } from "zod";

export const createAlbumSchema = z.object({
	name: z.string().min(1, "Album name is required").max(255),
	artistId: z.number().int().positive(),
	cover: z.url("Must be a valid URL").max(255),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;
