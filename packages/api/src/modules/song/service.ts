import { randomUUID } from "node:crypto";
import { album, db, song } from "@opium/db";
import { and, desc, eq } from "@opium/db/drizzle";
import { artist, interaction } from "@opium/db/schema/music";
import type { CreateSongInput, EditSongInput } from "./validation";

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

	async getLatest(limit: number) {
		return await db
			.select({
				id: song.id,
				title: song.title,
				artist: artist.name,
				url: song.fileUrl,
				cover: album.cover,
				albumId: song.albumId,
				artistId: artist.id,
				type: song.type,
				duration: song.length,
				createdAt: song.createdAt,
			})
			.from(song)
			.innerJoin(artist, eq(song.artistId, artist.id))
			.innerJoin(album, eq(song.albumId, album.id))
			.orderBy(desc(song.createdAt))
			.limit(limit);
	},

	async toggleLike(userId: string, songId: string) {
		const [existing] = await db
			.select()
			.from(interaction)
			.where(
				and(eq(interaction.userId, userId), eq(interaction.songId, songId)),
			);

		if (existing) {
			const newLikedState = !existing.liked;
			await db
				.update(interaction)
				.set({ liked: newLikedState })
				.where(
					and(eq(interaction.userId, userId), eq(interaction.songId, songId)),
				);
			return newLikedState;
		}

		await db.insert(interaction).values({
			userId,
			songId,
			liked: true,
			playCount: 0,
		});
		return true;
	},

	async edit(data: EditSongInput) {
		const [updatedSong] = await db
			.update(song)
			.set(data)
			.where(eq(song.id, data.songId))
			.returning();
		return updatedSong;
	},
};
