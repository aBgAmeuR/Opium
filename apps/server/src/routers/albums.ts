import { asc, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { publicProcedure, protectedProcedure } from "../lib/orpc";
import { albums } from "../db/schema/tracks";

const zId = z.number().int().positive();

export const albumsRouter = {
  list: publicProcedure
    .input(z.object({ query: z.string().optional(), limit: z.number().int().min(1).max(100).default(50), offset: z.number().int().min(0).default(0) }))
    .handler(async ({ input }) => {
      const like = input.query ? `%${input.query}%` : undefined;
      const base = like
        ? db.select().from(albums).where(sql`${albums.title} LIKE ${like}`)
        : db.select().from(albums);
      const rows = await base.orderBy(asc(albums.title)).limit(input.limit).offset(input.offset);
      return rows;
    }),
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1), coverUrl: z.string().url() }))
    .handler(async ({ input, context }) => {
      if (context.session?.user?.email !== "admin@admin.com") throw new Error("UNAUTHORIZED");
      const inserted = await db.insert(albums).values({ title: input.title, coverUrl: input.coverUrl }).returning();
      return inserted[0];
    }),
};


