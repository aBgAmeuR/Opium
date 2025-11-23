import { db } from "@opium/db";
import { count, eq, sql } from "@opium/db/drizzle";
import { unionAll } from "@opium/db/pg-core";
import {
	album,
	albumLikes,
	artist,
	playlist,
	playlistLikes,
	playlistsToSongs,
	song,
} from "@opium/db/schema/music";

export const libraryService = {
	async getLibrary(userId: string) {
		const getOwnPlaylistsQuery = db
			.select({
				id: playlist.id,
				name: playlist.name,
				type: sql`'playlist'`,
				image: playlist.image,
				likedAt: playlist.createdAt,
				totalSongs: count(playlistsToSongs.songId),
				createdByUser: sql<boolean>`TRUE`,
			})
			.from(playlist)
			.leftJoin(playlistsToSongs, eq(playlist.id, playlistsToSongs.playlistId))
			.where(eq(playlist.userId, userId))
			.groupBy(playlist.id);
		const getLikedPlaylistsQuery = db
			.select({
				id: playlist.id,
				name: playlist.name,
				type: sql`'playlist'`,
				image: playlist.image,
				likedAt: playlistLikes.createdAt,
				totalSongs: count(playlistsToSongs.songId),
				createdByUser: sql<boolean>`FALSE`,
			})
			.from(playlistLikes)
			.innerJoin(playlist, eq(playlistLikes.playlistId, playlist.id))
			.leftJoin(playlistsToSongs, eq(playlist.id, playlistsToSongs.playlistId))
			.where(eq(playlistLikes.userId, userId))
			.groupBy(playlist.id, playlistLikes.createdAt);
		const getLikedAlbumsQuery = db
			.select({
				id: album.id,
				name: album.name,
				type: sql`'album'`,
				image: album.cover,
				likedAt: albumLikes.createdAt,
				totalSongs: count(song.id),
				createdByUser: sql<boolean>`FALSE`,
			})
			.from(albumLikes)
			.innerJoin(album, eq(albumLikes.albumId, album.id))
			.innerJoin(artist, eq(album.artistId, artist.id))
			.leftJoin(song, eq(album.id, song.albumId))
			.where(eq(albumLikes.userId, userId))
			.groupBy(album.id, artist.id, albumLikes.createdAt);
		return await unionAll(
			getOwnPlaylistsQuery,
			getLikedPlaylistsQuery,
			getLikedAlbumsQuery,
		);
	},
};
