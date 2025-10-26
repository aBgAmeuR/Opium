import { randomUUID } from "node:crypto";
import { album, db, song } from "@opium/db";
import { desc, eq } from "@opium/db/drizzle";
import { artist } from "@opium/db/schema/music";
import type { CreateSongInput } from "./validation";

export const songService = {
	async create(data: CreateSongInput) {
		const [newSong] = await db
			.insert(song)
			.values({
				id: randomUUID(),
				albumId: data.albumId,
				artistId: data.artistId,
				title: data.title,
				producers: data.producers,
				type: data.type,
				length: data.length,
				fileUrl: data.fileUrl,
			})
			.returning();

		return newSong;
	},

	async list() {
		return await db
			.select({
				id: song.id,
				title: song.title,
				type: song.type,
				length: song.length,
				fileUrl: song.fileUrl,
				artistId: artist.id,
				artistName: artist.name,
				albumId: album.id,
				albumName: album.name,
				albumCover: album.cover,
				createdAt: song.createdAt,
				updatedAt: song.updatedAt,
			})
			.from(song)
			.innerJoin(album, eq(song.albumId, album.id))
			.innerJoin(artist, eq(song.artistId, artist.id))
			.orderBy(desc(song.createdAt));
	},
};
