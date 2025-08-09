import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const versionTypes = ["official", "remix", "performance", "remastered", "remastered AI", "AI", "fan made", "feature", "leak", "other"] as const;

export const albums = sqliteTable("albums", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    coverUrl: text("cover_url").notNull(),
});

export const tracks = sqliteTable("tracks", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    alternateTitles: text('alternate_titles', { mode: 'json' })
        .notNull()
        .$type<string[]>()
        .default(sql`(json_array())`),
    albumId: integer('album_id', { mode: 'number' }).references(() => albums.id).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$default(() => new Date()),
});

export const trackVersions = sqliteTable("track_versions", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    trackId: integer('track_id', { mode: 'number' })
        .references(() => tracks.id, { onDelete: "cascade" }).notNull(),
    type: text({ enum: versionTypes }).notNull(),
    title: text().notNull(),
    artists: text('artists', { mode: 'json' })
        .notNull()
        .$type<string[]>()
        .default(sql`(json_array())`),
    fileUrl: text('file_url').notNull(),
    orderIndex: integer("order_index").notNull().$default(() => 0),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$default(() => new Date()),
});


