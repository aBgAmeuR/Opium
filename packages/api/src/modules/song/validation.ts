import { z } from "zod";

export const trackTypesEnum = [
	"official",
	"remix",
	"performance",
	"remastered",
	"AI",
	"fan made",
	"feature",
	"leak",
] as const;

export const createSongSchema = z.object({
	title: z.string().min(1, "Title is required").max(255),
	artistId: z.number().int().positive(),
	albumId: z.number().int().positive(),
	type: z.enum(trackTypesEnum),
	length: z.number().int().positive(),
	fileUrl: z.url().max(255),
	featuredArtistIds: z.array(z.number().int().positive()).optional(),
	producers: z.array(z.string()).optional(),
});

export type CreateSongInput = z.infer<typeof createSongSchema>;

export const getLatestSongSchema = z.object({
	limit: z.number().int().positive().max(100).min(1).default(10),
});

export type GetLatestSongInput = z.infer<typeof getLatestSongSchema>;

export const toggleLikeSchema = z.object({
	songId: z.string(),
});

export type ToggleLikeInput = z.infer<typeof toggleLikeSchema>;

export const editSongSchema = z.object({
	songId: z.string(),
	title: z.string().optional(),
	artistId: z.number().int().positive().optional(),
	albumId: z.number().int().positive().optional(),
	type: z.enum(trackTypesEnum).optional(),
	producers: z.array(z.string()).optional(),
});

export type EditSongInput = z.infer<typeof editSongSchema>;
