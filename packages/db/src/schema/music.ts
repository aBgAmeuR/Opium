import {
	boolean,
	integer,
	pgTable,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

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

export const playlistVisibilitiesEnum = ["public", "private"] as const;

export const artist = pgTable("artist", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
	name: varchar("name", { length: 255 }).notNull(),
	image: varchar("image", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const album = pgTable("album", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
	artistId: integer("artist_id")
		.notNull()
		.references(() => artist.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 255 }).notNull(),
	cover: varchar("cover", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const song = pgTable("song", {
	id: varchar("id", { length: 255 }).primaryKey(),
	albumId: integer("album_id")
		.notNull()
		.references(() => album.id, { onDelete: "cascade" }),
	artistId: integer("artist_id")
		.notNull()
		.references(() => artist.id, { onDelete: "cascade" }),
	title: varchar("title", { length: 255 }).notNull(),
	fileUrl: varchar("file_url", { length: 255 }).notNull(),
	producers: text("producers").$type<string[]>(),
	type: text("type", { enum: trackTypesEnum }).notNull(),
	length: integer("length").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const songsToFeaturedArtists = pgTable(
	"songs_to_featured_artists",
	{
		songId: varchar("song_id", { length: 255 })
			.notNull()
			.references(() => song.id, { onDelete: "cascade" }),
		artistId: integer("artist_id")
			.notNull()
			.references(() => artist.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.songId, table.artistId] })],
);

export const playlist = pgTable("playlist", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	name: varchar("name", { length: 255 }).notNull(),
	visibility: text("visibility", { enum: playlistVisibilitiesEnum }).notNull(),
	image: varchar("image", { length: 255 }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const playlistsToSongs = pgTable(
	"playlists_to_songs",
	{
		playlistId: integer("playlist_id")
			.notNull()
			.references(() => playlist.id, { onDelete: "cascade" }),
		songId: varchar("song_id", { length: 255 })
			.notNull()
			.references(() => song.id, { onDelete: "cascade" }),
	},
	(table) => [primaryKey({ columns: [table.playlistId, table.songId] })],
);

export const interaction = pgTable(
	"interaction",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		songId: varchar("song_id", { length: 255 })
			.notNull()
			.references(() => song.id, { onDelete: "cascade" }),
		liked: boolean("liked").default(false).notNull(),
		playCount: integer("play_count").default(0).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.songId] })],
);
