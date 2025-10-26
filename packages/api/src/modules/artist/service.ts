import { album, db, song } from "@opium/db";
import { count, desc, eq } from "@opium/db/drizzle";
import { artist } from "@opium/db/schema/music";
import type { CreateArtistInput } from "./validation";

export const artistService = {
	async create(data: CreateArtistInput) {
		const [newArtist] = await db
			.insert(artist)
			.values({
				name: data.name,
				image: data.image,
			})
			.returning();

		return newArtist;
	},

	async list() {
		return await db
			.select({
				id: artist.id,
				name: artist.name,
				image: artist.image,
				totalSongs: count(song.id),
				totalAlbums: count(album.id),
				createdAt: artist.createdAt,
				updatedAt: artist.updatedAt,
			})
			.from(artist)
			.leftJoin(song, eq(artist.id, song.artistId))
			.leftJoin(album, eq(artist.id, album.artistId))
			.groupBy(artist.id)
			.orderBy(desc(artist.createdAt));
	},
};
