import { protectedProcedure, publicProcedure } from "../../procedures";
import { playlistService } from "./service";
import {
	addToPlaylistSchema,
	createPlaylistSchema,
	getPlaylistSchema,
	removeFromPlaylistSchema,
	toggleLikeSchema,
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

	getById: publicProcedure
		.input(getPlaylistSchema)
		.handler(async ({ input, context }) => {
			const userId = context.session?.user?.id ?? null;
			return await playlistService.getById(userId, input.id);
		}),

	getSongs: publicProcedure
		.input(getPlaylistSchema)
		.handler(async ({ input }) => await playlistService.getSongs(input.id)),

	toggleLike: protectedProcedure
		.input(toggleLikeSchema)
		.handler(
			async ({ input, context }) =>
				await playlistService.toggleLike(
					context.session.user.id,
					input.playlistId,
				),
		),

	addToPlaylist: protectedProcedure
		.input(addToPlaylistSchema)
		.handler(async ({ input, context }) => {
			return await playlistService.addToPlaylist(
				context.session.user.id,
				input.playlistId,
				input.songId,
			);
		}),

	removeFromPlaylist: protectedProcedure
		.input(removeFromPlaylistSchema)
		.handler(async ({ input, context }) => {
			return await playlistService.removeFromPlaylist(
				context.session.user.id,
				input.playlistId,
				input.songId,
			);
		}),

	getLikedTracks: protectedProcedure
		.handler(async ({ context }) => {
			return await playlistService.getLikedTracks(context.session.user.id);
		}),
};
