import { relations } from "drizzle-orm";
import { user } from "./auth";
import {
	album,
	artist,
	interaction,
	playlist,
	playlistsToSongs,
	song,
} from "./music";

export const userRelations = relations(user, ({ many }) => ({
	playlists: many(playlist),
	interactions: many(interaction),
}));

export const artistRelations = relations(artist, ({ many }) => ({
	albums: many(album),
	songs: many(song),
}));

export const albumRelations = relations(album, ({ one, many }) => ({
	artist: one(artist, {
		fields: [album.artistId],
		references: [artist.id],
	}),
	songs: many(song),
}));

export const songRelations = relations(song, ({ one, many }) => ({
	album: one(album, {
		fields: [song.albumId],
		references: [album.id],
	}),
	artist: one(artist, {
		fields: [song.artistId],
		references: [artist.id],
	}),
	playlistSongs: many(playlistsToSongs),
	interactions: many(interaction),
}));

export const playlistRelations = relations(playlist, ({ one, many }) => ({
	user: one(user, {
		fields: [playlist.userId],
		references: [user.id],
	}),
	playlistSongs: many(playlistsToSongs),
}));

export const playlistsToSongsRelations = relations(
	playlistsToSongs,
	({ one }) => ({
		playlist: one(playlist, {
			fields: [playlistsToSongs.playlistId],
			references: [playlist.id],
		}),
		song: one(song, {
			fields: [playlistsToSongs.songId],
			references: [song.id],
		}),
	}),
);

export const interactionRelations = relations(interaction, ({ one }) => ({
	user: one(user, {
		fields: [interaction.userId],
		references: [user.id],
	}),
	song: one(song, {
		fields: [interaction.songId],
		references: [song.id],
	}),
}));
