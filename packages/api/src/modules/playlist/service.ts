import { db } from "@opium/db";
import { and, asc, count, desc, eq, sql } from "@opium/db/drizzle";
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
				liked: userId
					? sql<boolean>`exists(select 1 from ${playlistLikes} where ${playlistLikes.playlistId} = ${playlist.id} and ${playlistLikes.userId} = ${userId})`
					: sql<boolean>`false`,
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

	async getSongs(playlistId: number) {
		return await db
			.select({
				id: song.id,
				title: song.title,
				artist: artist.name,
				url: song.fileUrl,
				albumId: song.albumId,
				album: album.name,
				artwork: album.cover,
				artistId: artist.id,
				type: song.type,
				duration: song.length,
			})
			.from(playlistsToSongs)
			.innerJoin(song, eq(playlistsToSongs.songId, song.id))
			.innerJoin(artist, eq(song.artistId, artist.id))
			.innerJoin(album, eq(song.albumId, album.id))
			.where(eq(playlistsToSongs.playlistId, playlistId))
			.orderBy(asc(song.createdAt));
	},

	async toggleLike(userId: string, playlistId: number) {
		const [existing] = await db
			.select()
			.from(playlistLikes)
			.where(
				and(
					eq(playlistLikes.userId, userId),
					eq(playlistLikes.playlistId, playlistId),
				),
			);

		if (existing) {
			await db
				.delete(playlistLikes)
				.where(
					and(
						eq(playlistLikes.userId, userId),
						eq(playlistLikes.playlistId, playlistId),
					),
				);
			return false;
		}

		await db.insert(playlistLikes).values({
			userId,
			playlistId,
		});
		return true;
	},

	async addToPlaylist(userId: string, playlistId: number, songId: string) {
		const [playlistData] = await db
			.select()
			.from(playlist)
			.where(and(eq(playlist.id, playlistId), eq(playlist.userId, userId)));

		if (!playlistData) {
			throw new Error("Playlist not found or you don't have permission");
		}

		await db.insert(playlistsToSongs).values({ playlistId, songId });
	},

	async removeFromPlaylist(userId: string, playlistId: number, songId: string) {
		const [playlistData] = await db
			.select()
			.from(playlist)
			.where(and(eq(playlist.id, playlistId), eq(playlist.userId, userId)));

		if (!playlistData) {
			throw new Error("Playlist not found or you don't have permission");
		}

		await db
			.delete(playlistsToSongs)
			.where(
				and(
					eq(playlistsToSongs.playlistId, playlistId),
					eq(playlistsToSongs.songId, songId),
				),
			);
	},
};
