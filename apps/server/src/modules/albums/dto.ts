import { z } from "zod";

export const zListAlbumsInput = z.object({
  query: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export const zCreateAlbumInput = z.object({
  title: z.string().min(1),
  coverUrl: z.string().url(),
});

export type ListAlbumsInput = z.infer<typeof zListAlbumsInput>;
export type CreateAlbumInput = z.infer<typeof zCreateAlbumInput>;


