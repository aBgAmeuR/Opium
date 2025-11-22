import { z } from "zod";

export const createAlbumSchema = z.object({
	name: z.string().min(1, "Album name is required").max(255),
	artistId: z.number().int().positive(),
	cover: z.url("Must be a valid URL").max(255),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;

export const getAlbumSchema = z.object({
	id: z.number().int().positive(),
});

export type GetAlbumInput = z.infer<typeof getAlbumSchema>;

export const toggleLikeSchema = z.object({
	albumId: z.number().int().positive(),
});

export type ToggleLikeInput = z.infer<typeof toggleLikeSchema>;
