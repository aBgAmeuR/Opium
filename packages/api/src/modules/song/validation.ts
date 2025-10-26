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
