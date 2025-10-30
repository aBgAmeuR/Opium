import { db } from "@opium/db";
import { and, count, desc, eq } from "@opium/db/drizzle";
import {
	album,
	albumLikes,
	artist,
	playlist,
	playlistLikes,
	playlistsToSongs,
	song,
} from "@opium/db/schema/music";
import type { CreatePlaylistInput, UpdatePlaylistInput } from "./validation";

export const playlistService = {
	async create(userId: string, data?: CreatePlaylistInput) {
		const playlistName =
			data?.name || `Ma playlist ${new Date().toLocaleDateString()}`;

		const [newPlaylist] = await db
			.insert(playlist)
			.values({
				userId,
				name: playlistName,
				visibility: "private",
			})
			.returning();

		return newPlaylist;
	},

	async update(userId: string, data: UpdatePlaylistInput) {
		const [updatedPlaylist] = await db
			.update(playlist)
			.set({
				...(data.name && { name: data.name }),
				...(data.image !== undefined && { image: data.image }),
				...(data.visibility && { visibility: data.visibility }),
			})
			.where(and(eq(playlist.id, data.id), eq(playlist.userId, userId)))
			.returning();

		if (!updatedPlaylist) {
			throw new Error("Playlist not found or you don't have permission");
		}

		return updatedPlaylist;
	},

	async getById(userId: string | null, playlistId: number) {
		const [playlistData] = await db
			.select({
				id: playlist.id,
				userId: playlist.userId,
				name: playlist.name,
				visibility: playlist.visibility,
				image: playlist.image,
				createdAt: playlist.createdAt,
				updatedAt: playlist.updatedAt,
				totalSongs: count(playlistsToSongs.songId),
			})
			.from(playlist)
			.leftJoin(playlistsToSongs, eq(playlist.id, playlistsToSongs.playlistId))
			.where(eq(playlist.id, playlistId))
			.groupBy(playlist.id);

		if (!playlistData) {
			throw new Error("Playlist not found");
		}

		if (
			playlistData.visibility === "private" &&
			playlistData.userId !== userId
		) {
			throw new Error("Playlist not found");
		}

		return playlistData;
	},

	async getOwnPlaylists(userId: string) {
		return await db
			.select({
				id: playlist.id,
				name: playlist.name,
				visibility: playlist.visibility,
				image: playlist.image,
				createdAt: playlist.createdAt,
				updatedAt: playlist.updatedAt,
				totalSongs: count(playlistsToSongs.songId),
			})
			.from(playlist)
			.leftJoin(playlistsToSongs, eq(playlist.id, playlistsToSongs.playlistId))
			.where(eq(playlist.userId, userId))
			.groupBy(playlist.id)
			.orderBy(desc(playlist.createdAt));
	},

	async getLikedPlaylists(userId: string) {
		return await db
			.select({
				id: playlist.id,
				name: playlist.name,
				visibility: playlist.visibility,
				image: playlist.image,
				userId: playlist.userId,
				createdAt: playlist.createdAt,
				updatedAt: playlist.updatedAt,
				totalSongs: count(playlistsToSongs.songId),
			})
			.from(playlistLikes)
			.innerJoin(playlist, eq(playlistLikes.playlistId, playlist.id))
			.leftJoin(playlistsToSongs, eq(playlist.id, playlistsToSongs.playlistId))
			.where(eq(playlistLikes.userId, userId))
			.groupBy(playlist.id, playlistLikes.createdAt)
			.orderBy(desc(playlistLikes.createdAt));
	},

	async getLikedAlbums(userId: string) {
		return await db
			.select({
				id: album.id,
				name: album.name,
				cover: album.cover,
				artistId: album.artistId,
				artistName: artist.name,
				createdAt: album.createdAt,
				updatedAt: album.updatedAt,
				totalSongs: count(song.id),
			})
			.from(albumLikes)
			.innerJoin(album, eq(albumLikes.albumId, album.id))
			.innerJoin(artist, eq(album.artistId, artist.id))
			.leftJoin(song, eq(album.id, song.albumId))
			.where(eq(albumLikes.userId, userId))
			.groupBy(album.id, artist.id, albumLikes.createdAt)
			.orderBy(desc(albumLikes.createdAt));
	},
};
