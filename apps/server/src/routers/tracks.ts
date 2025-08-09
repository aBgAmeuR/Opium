import { eq, asc, desc, sql, inArray, count } from "drizzle-orm";
import { z } from "zod";
import type { InferInsertModel } from "drizzle-orm";
import { db } from "../db";
import { protectedProcedure, publicProcedure } from "../lib/orpc";
import { albums, trackVersions, tracks, versionTypes } from "../db/schema/tracks";

const zId = z.number().int().positive();
type VersionType = (typeof versionTypes)[number];
const zVersionType = z.enum(versionTypes as unknown as [VersionType, ...VersionType[]]);
type TrackVersionInsert = InferInsertModel<typeof trackVersions>;

export const tracksRouter = {
  versionTypes: publicProcedure.handler(() => Array.from(versionTypes)),
  list: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        sortBy: z.enum(["createdAt"]).default("createdAt"),
        sortDir: z.enum(["asc", "desc"]).default("desc"),
        versionType: zVersionType.optional(),
        limit: z.number().int().min(1).max(100).default(50),
        offset: z.number().int().min(0).default(0),
      })
    )
    .handler(async ({ input }) => {
      const q = input.query?.trim();

      let where = undefined;
      // Filter by search using alternateTitles or first version's title
      if (q) {
        // match alternate titles
        const like = `%${q}%`;
        // find track ids that have a version title like or artists like
        const matchVersionIds = await db
          .select({ id: trackVersions.trackId })
          .from(trackVersions)
          .where(sql`${trackVersions.title} LIKE ${like}`)
          .groupBy(trackVersions.trackId);
        const versionIds = matchVersionIds.map((r) => r.id);
        const matchAltTitleIds = await db
          .select({ id: tracks.id })
          .from(tracks)
          .where(sql`EXISTS (SELECT 1 FROM json_each(${tracks.alternateTitles}) je WHERE je.value LIKE ${like})`);
        const altIds = matchAltTitleIds.map((r) => r.id);
        const ids = Array.from(new Set([...versionIds, ...altIds]));
        where = ids.length ? inArray(tracks.id, ids) : sql`1=0`;
      }
      if (input.versionType) {
        const idsRes = await db
          .select({ id: trackVersions.trackId })
          .from(trackVersions)
          .where(eq(trackVersions.type, input.versionType as VersionType))
          .groupBy(trackVersions.trackId);
        const ids = idsRes.map((r) => r.id);
        where = where ? sql`${where} AND ${inArray(tracks.id, ids)}` : (ids.length ? inArray(tracks.id, ids) : sql`1=0`);
      }

      const orderBy = input.sortDir === "asc" ? asc(tracks.createdAt) : desc(tracks.createdAt);

      const base = where
        ? db.select().from(tracks).where(where)
        : db.select().from(tracks);
      const rows = await base.orderBy(orderBy).limit(input.limit).offset(input.offset);

      const totalRow = await (
        where ? db.select({ c: count() }).from(tracks).where(where) : db.select({ c: count() }).from(tracks)
      );
      const total = Number(totalRow?.[0]?.c ?? 0);

      const ids = rows.map((r) => r.id);
      const versions = ids.length
        ? await db
            .select()
            .from(trackVersions)
            .where(inArray(trackVersions.trackId, ids))
            .orderBy(asc(trackVersions.orderIndex))
        : [];
      const albumsRows = ids.length
        ? await db
            .select()
            .from(albums)
            .where(inArray(albums.id, rows.map((r) => r.albumId)))
        : [];
      const albumById = new Map(albumsRows.map((a) => [a.id, a]));
      const items = rows.map((t) => ({
        id: t.id,
        createdAt: t.createdAt,
        alternateTitles: t.alternateTitles,
        albumId: t.albumId,
        album: albumById.get(t.albumId) ?? null,
        versions: versions.filter(v => v.trackId === t.id),
      }));
      return { items, total };
    }),

  byId: publicProcedure.input(z.object({ id: zId })).handler(async ({ input }) => {
    const row = await db.select().from(tracks).where(eq(tracks.id, input.id)).limit(1);
    if (row.length === 0) return null;
    const vers = await db
      .select()
      .from(trackVersions)
      .where(eq(trackVersions.trackId, input.id))
      .orderBy(asc(trackVersions.orderIndex));
    const album = await db.select().from(albums).where(eq(albums.id, row[0].albumId)).limit(1);
    return { ...row[0], album: album[0] ?? null, versions: vers };
  }),

  create: protectedProcedure
    .input(
      z.object({
        albumId: zId,
        alternateTitles: z.array(z.string()).default([]),
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
      })
    )
    .handler(async ({ input, context }) => {
      // Optional admin check: only allow specific email for now
      if (context.session?.user?.email !== "admin@admin.com") {
        throw new Error("UNAUTHORIZED");
      }

      const derivedTitle = input.versions[0]?.title ?? "Untitled";
      const derivedArtists = Array.from(
        new Set(input.versions.flatMap((v) => v.artists))
      );
      const newTrack = await db
        .insert(tracks)
        .values({
          title: derivedTitle,
          albumId: input.albumId,
          artists: derivedArtists,
          alternateTitles: input.alternateTitles,
        })
        .returning();
      const track = newTrack[0];

      const values: TrackVersionInsert[] = input.versions.map((v, idx) => ({
        trackId: track.id,
        type: v.type as VersionType,
        title: v.title,
        artists: v.artists,
        fileUrl: v.fileUrl,
        orderIndex: idx,
      }));
      await db.insert(trackVersions).values(values);

      return track;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: zId,
        albumId: zId,
        alternateTitles: z.array(z.string()).default([]),
      })
    )
    .handler(async ({ input, context }) => {
      if (context.session?.user?.email !== "admin@admin.com") {
        throw new Error("UNAUTHORIZED");
      }
      await db
        .update(tracks)
        .set({
          albumId: input.albumId,
          alternateTitles: input.alternateTitles,
        })
        .where(eq(tracks.id, input.id));
      const updated = await db.select().from(tracks).where(eq(tracks.id, input.id)).limit(1);
      if (updated.length === 0) throw new Error("Not found");
      return updated[0];
    }),

  remove: protectedProcedure
    .input(z.object({ id: zId }))
    .handler(async ({ input, context }) => {
      if (context.session?.user?.email !== "admin@admin.com") {
        throw new Error("UNAUTHORIZED");
      }
      await db.delete(trackVersions).where(eq(trackVersions.trackId, input.id));
      await db.delete(tracks).where(eq(tracks.id, input.id));
      return { ok: true };
    }),

  // Versions
  addVersion: protectedProcedure
    .input(
      z.object({
        trackId: zId,
        type: zVersionType,
        title: z.string().min(1),
        artists: z.array(z.string().min(1)).default([]),
        fileUrl: z.string().min(1),
      })
    )
    .handler(async ({ input, context }) => {
      if (context.session?.user?.email !== "admin@admin.com") {
        throw new Error("UNAUTHORIZED");
      }
      const maxRows = await db
        .select({ orderIndex: trackVersions.orderIndex })
        .from(trackVersions)
        .where(eq(trackVersions.trackId, input.trackId))
        .orderBy(desc(trackVersions.orderIndex))
        .limit(1);
      const nextIndex = ((maxRows[0]?.orderIndex as number | undefined) ?? -1) + 1;
      const inserted = await db
        .insert(trackVersions)
        .values({ trackId: input.trackId, type: input.type, title: input.title, artists: input.artists, fileUrl: input.fileUrl, orderIndex: nextIndex } as TrackVersionInsert)
        .returning();
      return inserted[0];
    }),

  updateVersion: protectedProcedure
    .input(
      z.object({
        id: zId,
        type: zVersionType,
        title: z.string().min(1),
        artists: z.array(z.string().min(1)).default([]),
        fileUrl: z.string().min(1),
      })
    )
    .handler(async ({ input, context }) => {
      if (context.session?.user?.email !== "admin@admin.com") {
        throw new Error("UNAUTHORIZED");
      }
      await db.update(trackVersions).set({ type: input.type, title: input.title, artists: input.artists, fileUrl: input.fileUrl }).where(eq(trackVersions.id, input.id));
      const updated = await db
        .select()
        .from(trackVersions)
        .where(eq(trackVersions.id, input.id))
        .limit(1);
      if (updated.length === 0) throw new Error("Not found");
      return updated[0];
    }),

  removeVersion: protectedProcedure
    .input(z.object({ id: zId }))
    .handler(async ({ input, context }) => {
      if (context.session?.user?.email !== "admin@admin.com") {
        throw new Error("UNAUTHORIZED");
      }
      await db.delete(trackVersions).where(eq(trackVersions.id, input.id));
      return { ok: true };
    }),

  reorderVersions: protectedProcedure
    .input(
      z.object({
        trackId: zId,
        orderedIds: z.array(zId).min(1),
      })
    )
    .handler(async ({ input, context }) => {
      if (context.session?.user?.email !== "admin@admin.com") {
        throw new Error("UNAUTHORIZED");
      }
      const updates = input.orderedIds.map((id, idx) =>
        db.update(trackVersions).set({ orderIndex: idx }).where(eq(trackVersions.id, id))
      );
      await Promise.all(updates);
      const versions = await db
        .select()
        .from(trackVersions)
        .where(eq(trackVersions.trackId, input.trackId))
        .orderBy(asc(trackVersions.orderIndex));
      return versions;
    }),
};


