import { z } from "zod";
import { versionTypes } from "../../db/schema/tracks";

export const zId = z.number().int().positive();
export const zVersionType = z.enum(versionTypes);

export const zListTracksInput = z.object({
  query: z.string().optional(),
  sortBy: z.enum(["createdAt", "title", "albumTitle"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  versionType: zVersionType.optional(),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export const zCreateTrackInput = z.object({
  albumId: zId,
  alternateTitles: z.array(z.string()).default([]),
  title: z.string().min(1).optional(),
  artists: z.array(z.string().min(1)).optional(),
  producers: z.array(z.string().min(1)).default([]),
  versions: z
    .array(
      z.object({
        type: zVersionType,
        title: z.string().min(1),
        fileUrl: z.string().min(1),
        artists: z.array(z.string().min(1)).default([]),
      })
    )
    .min(1),
});

export const zUpdateTrackInput = z.object({
  id: zId,
  albumId: zId,
  alternateTitles: z.array(z.string()).default([]),
});

export const zTrackIdInput = z.object({ id: zId });

export const zAddVersionInput = z.object({
  trackId: zId,
  type: zVersionType,
  title: z.string().min(1),
  artists: z.array(z.string().min(1)).default([]),
  fileUrl: z.string().min(1),
});

export const zUpdateVersionInput = z.object({
  id: zId,
  type: zVersionType,
  title: z.string().min(1),
  artists: z.array(z.string().min(1)).default([]),
  fileUrl: z.string().min(1),
});

export const zReorderVersionsInput = z.object({
  trackId: zId,
  orderedIds: z.array(zId).min(1),
});

export type ListTracksInput = z.infer<typeof zListTracksInput>;
export type CreateTrackInput = z.infer<typeof zCreateTrackInput>;
export type UpdateTrackInput = z.infer<typeof zUpdateTrackInput>;
export type TrackIdInput = z.infer<typeof zTrackIdInput>;
export type AddVersionInput = z.infer<typeof zAddVersionInput>;
export type UpdateVersionInput = z.infer<typeof zUpdateVersionInput>;
export type ReorderVersionsInput = z.infer<typeof zReorderVersionsInput>;


