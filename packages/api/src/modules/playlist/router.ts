import { protectedProcedure } from "../../procedures";
import { playlistService } from "./service";
import {
	createPlaylistSchema,
	getPlaylistSchema,
	updatePlaylistSchema,
} from "./validation";

export const playlistRouter = {
	create: protectedProcedure
		.input(createPlaylistSchema.optional())
		.handler(async ({ input, context }) => {
			if (!context.session?.user?.id) {
				throw new Error("Unauthorized");
			}
			return await playlistService.create(context.session.user.id, input);
		}),

	update: protectedProcedure
		.input(updatePlaylistSchema)
		.handler(async ({ input, context }) => {
			if (!context.session?.user?.id) {
				throw new Error("Unauthorized");
			}
			return await playlistService.update(context.session.user.id, input);
		}),

	getById: protectedProcedure
		.input(getPlaylistSchema)
		.handler(async ({ input, context }) => {
			const userId = context.session?.user?.id ?? null;
			console.log("call", userId, input.id);
			return await playlistService.getById(userId, input.id);
		}),

	getOwnPlaylists: protectedProcedure.handler(async ({ context }) => {
		if (!context.session?.user?.id) {
			throw new Error("Unauthorized");
		}
		return await playlistService.getOwnPlaylists(context.session.user.id);
	}),

	getLikedPlaylists: protectedProcedure.handler(async ({ context }) => {
		if (!context.session?.user?.id) {
			throw new Error("Unauthorized");
		}
		return await playlistService.getLikedPlaylists(context.session.user.id);
	}),

	getLikedAlbums: protectedProcedure.handler(async ({ context }) => {
		if (!context.session?.user?.id) {
			throw new Error("Unauthorized");
		}
		return await playlistService.getLikedAlbums(context.session.user.id);
	}),
};
