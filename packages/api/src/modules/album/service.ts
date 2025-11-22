import { db } from "@opium/db";
import { and, asc, count, desc, eq, sql } from "@opium/db/drizzle";
import { album, albumLikes, artist, song } from "@opium/db/schema/music";
import type { CreateAlbumInput } from "./validation";

export const albumService = {
	async create(data: CreateAlbumInput) {
		const [newAlbum] = await db
			.insert(album)
			.values({
				name: data.name,
				cover: data.cover,
				artistId: data.artistId,
			})
			.returning();

		return newAlbum;
	},

	async list() {
		return await db
			.select({
				id: album.id,
				name: album.name,
				cover: album.cover,
				artistId: album.artistId,
				artistName: artist.name,
				totalSongs: count(song.id),
				createdAt: album.createdAt,
				updatedAt: album.updatedAt,
			})
			.from(album)
			.innerJoin(artist, eq(album.artistId, artist.id))
			.leftJoin(song, eq(album.id, song.albumId))
			.groupBy(album.id, artist.id)
			.orderBy(desc(album.createdAt));
	},

	async getById(id: number, userId?: string) {
		const [albumData] = await db
			.select({
				id: album.id,
				name: album.name,
				cover: album.cover,
				artistId: album.artistId,
				artistName: artist.name,
				artistImage: artist.image,
				totalSongs: count(song.id),
				createdAt: album.createdAt,
				updatedAt: album.updatedAt,
				liked: userId
					? sql<boolean>`exists(select 1 from ${albumLikes} where ${albumLikes.albumId} = ${album.id} and ${albumLikes.userId} = ${userId})`
					: sql<boolean>`false`,
			})
			.from(album)
			.innerJoin(artist, eq(album.artistId, artist.id))
			.leftJoin(song, eq(album.id, song.albumId))
			.where(eq(album.id, id))
			.groupBy(album.id, artist.id);

		if (!albumData) {
			throw new Error("Album not found");
		}

		return albumData;
	},

	async getSongs(id: number) {
		return await db
			.select({
				id: song.id,
				title: song.title,
				artist: artist.name,
				url: song.fileUrl,
				albumId: song.albumId,
				artistId: artist.id,
				type: song.type,
				duration: song.length,
			})
			.from(song)
			.innerJoin(artist, eq(song.artistId, artist.id))
			.where(eq(song.albumId, id))
			.orderBy(asc(song.createdAt));
	},

	async toggleLike(userId: string, albumId: number) {
		const [existing] = await db
			.select()
			.from(albumLikes)
			.where(
				and(eq(albumLikes.userId, userId), eq(albumLikes.albumId, albumId)),
			);

		if (existing) {
			await db
				.delete(albumLikes)
				.where(
					and(eq(albumLikes.userId, userId), eq(albumLikes.albumId, albumId)),
				);
			return false;
		}

		await db.insert(albumLikes).values({
			userId,
			albumId,
		});
		return true;
	},
};
