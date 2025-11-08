import { db } from "@opium/db";
import { count, desc, eq } from "@opium/db/drizzle";
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
};
