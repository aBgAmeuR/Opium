import { db } from "../../db";
import { albums } from "../../db/schema/tracks";
import { asc, eq, sql } from "drizzle-orm";

export const AlbumsRepository = {
  list: async (params: { like?: string; limit: number; offset: number }) => {
    const base = params.like ? db.select().from(albums).where(sql`${albums.title} LIKE ${params.like}`) : db.select().from(albums);
    return base.orderBy(asc(albums.title)).limit(params.limit).offset(params.offset);
  },

  insert: async (values: typeof albums.$inferInsert) => {
    const inserted = await db.insert(albums).values(values).returning();
    return inserted[0];
  },
};


