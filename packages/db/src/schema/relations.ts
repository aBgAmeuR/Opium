import { relations } from "drizzle-orm";
import { user } from "./auth";
import {
	album,
	albumLikes,
	artist,
	interaction,
	playlist,
	playlistLikes,
	playlistsToSongs,
	song,
	songsToFeaturedArtists,
} from "./music";

export const userRelations = relations(user, ({ many }) => ({
	playlists: many(playlist),
	interactions: many(interaction),
	playlistLikes: many(playlistLikes),
	albumLikes: many(albumLikes),
}));

export const artistRelations = relations(artist, ({ many }) => ({
	albums: many(album),
	songs: many(song),
	featuredOnSongs: many(songsToFeaturedArtists),
}));

export const albumRelations = relations(album, ({ one, many }) => ({
	artist: one(artist, {
		fields: [album.artistId],
		references: [artist.id],
	}),
	songs: many(song),
	likes: many(albumLikes),
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
	featuredArtists: many(songsToFeaturedArtists),
	playlistSongs: many(playlistsToSongs),
	interactions: many(interaction),
}));

export const playlistRelations = relations(playlist, ({ one, many }) => ({
	user: one(user, {
		fields: [playlist.userId],
		references: [user.id],
	}),
	playlistSongs: many(playlistsToSongs),
	likes: many(playlistLikes),
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

export const songsToFeaturedArtistsRelations = relations(
	songsToFeaturedArtists,
	({ one }) => ({
		song: one(song, {
			fields: [songsToFeaturedArtists.songId],
			references: [song.id],
		}),
		artist: one(artist, {
			fields: [songsToFeaturedArtists.artistId],
			references: [artist.id],
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
