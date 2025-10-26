import { z } from "zod";

export const createArtistSchema = z.object({
	name: z.string().min(1, "Artist name is required").max(255),
	image: z.url("Must be a valid URL").max(255),
});

export type CreateArtistInput = z.infer<typeof createArtistSchema>;
