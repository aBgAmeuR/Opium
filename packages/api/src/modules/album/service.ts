import { db } from "@opium/db";
import { asc, count, desc, eq } from "@opium/db/drizzle";
import { album, artist, song } from "@opium/db/schema/music";
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

	async getById(id: number) {
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
				fileUrl: song.fileUrl,
				type: song.type,
				length: song.length,
				producers: song.producers,
				artistId: artist.id,
				artistName: artist.name,
			})
			.from(song)
			.innerJoin(artist, eq(song.artistId, artist.id))
			.where(eq(song.albumId, id))
			.orderBy(asc(song.createdAt));
	},
};
