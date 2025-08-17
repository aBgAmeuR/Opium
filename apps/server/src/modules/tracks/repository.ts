import { db } from "../../db";
import { albums, trackVersions, tracks } from "../../db/schema/tracks";
import { asc, count, desc, eq, inArray, SQL, sql } from "drizzle-orm";

export const TracksRepository = {
  findById: async (id: number) => {
    const rows = await db.select().from(tracks).where(eq(tracks.id, id)).limit(1);
    return rows[0] ?? null;
  },

  findAlbumById: async (id: number) => {
    const rows = await db.select().from(albums).where(eq(albums.id, id)).limit(1);
    return rows[0] ?? null;
  },

  list: async (params: {
    where?: SQL;
    limit: number;
    offset: number;
    sortDir: "asc" | "desc";
    sortBy?: "createdAt" | "title" | "albumTitle";
  }) => {
    const orderByExpr = params.sortBy === "title"
      ? (params.sortDir === "asc" ? asc(tracks.title) : desc(tracks.title))
      : params.sortBy === "albumTitle"
        ? (params.sortDir === "asc" ? asc(albums.title) : desc(albums.title))
      : (params.sortDir === "asc" ? asc(tracks.createdAt) : desc(tracks.createdAt));
    const base = params.where ? db.select().from(tracks).where(params.where) : db.select().from(tracks);
    return base.orderBy(orderByExpr).limit(params.limit).offset(params.offset);
  },

  listWithDetails: async (params: {
    where?: SQL;
    limit: number;
    offset: number;
    sortDir: "asc" | "desc";
    sortBy?: "createdAt" | "title" | "albumTitle";
  }) => {
    const orderByExpr = params.sortBy === "title"
      ? (params.sortDir === "asc" ? asc(tracks.title) : desc(tracks.title))
      : params.sortBy === "albumTitle"
        ? (params.sortDir === "asc" ? asc(albums.title) : desc(albums.title))
      : (params.sortDir === "asc" ? asc(tracks.createdAt) : desc(tracks.createdAt));

    let baseQuery = db
      .select({
        trackId: tracks.id,
        trackTitle: tracks.title,
        trackArtists: tracks.artists,
        trackProducers: tracks.producers,
        trackCreatedAt: tracks.createdAt,
        trackAlternateTitles: tracks.alternateTitles,
        trackAlbumId: tracks.albumId,
        albumId: albums.id,
        albumTitle: albums.title,
        albumCoverUrl: albums.coverUrl,
        versionId: trackVersions.id,
        versionType: trackVersions.type,
        versionTitle: trackVersions.title,
        versionArtists: trackVersions.artists,
        versionFileUrl: trackVersions.fileUrl,
        versionOrderIndex: trackVersions.orderIndex,
        versionCreatedAt: trackVersions.createdAt,
      })
      .from(tracks)
      .leftJoin(albums, eq(tracks.albumId, albums.id))
      .leftJoin(trackVersions, eq(tracks.id, trackVersions.trackId));

    if (params.where) {
      baseQuery = baseQuery.where(params.where) as any;
    }

    return baseQuery
      .orderBy(orderByExpr, asc(trackVersions.orderIndex))
      .limit(params.limit)
      .offset(params.offset);
  },

  count: async (where?: SQL) => {
    const totalRow = await (where ? db.select({ c: count() }).from(tracks).where(where) : db.select({ c: count() }).from(tracks));
    return Number(totalRow?.[0]?.c ?? 0);
  },

  listVersionsByTrackIds: async (trackIds: number[]) => {
    if (!trackIds.length) return [];
    return db
      .select()
      .from(trackVersions)
      .where(inArray(trackVersions.trackId, trackIds))
      .orderBy(asc(trackVersions.orderIndex));
  },

  listAlbumsByIds: async (albumIds: number[]) => {
    if (!albumIds.length) return [];
    return db.select().from(albums).where(inArray(albums.id, albumIds));
  },

  searchWhereClause: async (q?: string) => {
    if (!q?.trim()) return undefined;
    const tokens = q.trim().split(/\s+/);

    let combined: SQL | undefined = undefined;
    for (const token of tokens) {
      const like = `%${token}%`;
      const clause = sql`
        (
          ${tracks.title} LIKE ${like}
          OR EXISTS (SELECT 1 FROM json_each(${tracks.alternateTitles}) je WHERE je.value LIKE ${like})
          OR EXISTS (SELECT 1 FROM json_each(${tracks.artists}) ta WHERE ta.value LIKE ${like})
          OR EXISTS (
            SELECT 1 FROM ${trackVersions} tv
            WHERE tv.track_id = ${tracks.id}
              AND (
                tv.title LIKE ${like}
                OR EXISTS (SELECT 1 FROM json_each(tv.artists) va WHERE va.value LIKE ${like})
              )
          )
        )`;
      combined = combined ? sql`${combined} AND ${clause}` : clause;
    }
    return combined;
  },

  filterByVersionType: async (where: SQL | undefined, versionType?: typeof trackVersions.$inferSelect["type"]) => {
    if (!versionType) return where;
    const versionFilter = sql`${trackVersions.type} = ${versionType}`;
    return where ? sql`${where} AND ${versionFilter}` : versionFilter;
  },

  insertTrack: async (values: typeof tracks.$inferInsert) => {
    const inserted = await db.insert(tracks).values(values).returning();
    return inserted[0];
  },

  insertVersions: async (
    values: Array<{
      trackId: number;
      type: (typeof trackVersions.$inferInsert)["type"];
      title: string;
      artists: (typeof trackVersions.$inferInsert)["artists"];
      fileUrl: string;
      orderIndex: number;
    }>
  ) => {
    await db.insert(trackVersions).values(values);
  },

  updateTrack: async (id: number, values: Partial<typeof tracks.$inferInsert>) => {
    await db.update(tracks).set(values).where(eq(tracks.id, id));
  },

  deleteTrackWithVersions: async (id: number) => {
    await db.delete(trackVersions).where(eq(trackVersions.trackId, id));
    await db.delete(tracks).where(eq(tracks.id, id));
  },

  maxOrderIndexForTrack: async (trackId: number) => {
    const maxRows = await db
      .select({ orderIndex: trackVersions.orderIndex })
      .from(trackVersions)
      .where(eq(trackVersions.trackId, trackId))
      .orderBy(desc(trackVersions.orderIndex))
      .limit(1);
    return maxRows[0]?.orderIndex ?? -1;
  },

  insertVersion: async (values: typeof trackVersions.$inferInsert) => {
    const inserted = await db.insert(trackVersions).values(values).returning();
    return inserted[0];
  },

  updateVersion: async (id: number, values: Partial<typeof trackVersions.$inferInsert>) => {
    await db.update(trackVersions).set(values).where(eq(trackVersions.id, id));
  },

  deleteVersion: async (id: number) => {
    await db.delete(trackVersions).where(eq(trackVersions.id, id));
  },

  listVersionsByTrackId: async (trackId: number) => {
    return db.select().from(trackVersions).where(eq(trackVersions.trackId, trackId)).orderBy(asc(trackVersions.orderIndex));
  },
};


