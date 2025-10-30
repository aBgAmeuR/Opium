import { playlistVisibilitiesEnum } from "@opium/db/schema/music";
import { z } from "zod";

export const createPlaylistSchema = z.object({
	name: z.string().min(1).max(255).optional(),
});

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;

export const updatePlaylistSchema = z.object({
	id: z.number().int().positive(),
	name: z.string().min(1).max(255).optional(),
	image: z.string().url().max(255).optional().nullable(),
	visibility: z.enum(playlistVisibilitiesEnum).optional(),
});

export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>;

export const getPlaylistSchema = z.object({
	id: z.number().int().positive(),
});

export type GetPlaylistInput = z.infer<typeof getPlaylistSchema>;
