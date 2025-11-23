import { type Track, useAudioStore } from "@opium/audio";
import {
	DeleteIcon,
	HeartIcon,
	MoreIcon,
	PlayIcon,
	PlusIcon,
	QueueIcon,
	ShareIcon,
} from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuSub,
	MenuSubPopup,
	MenuSubTrigger,
	MenuTrigger,
} from "@opium/ui/components/menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { Route } from "@/routes/_app";
import { orpc } from "@/utils/orpc";

type CollectionTableMenuProps = {
	tracks: Track[];
	track: Track;
	libraryId?: number;
};

export const CollectionTableMenu = ({
	tracks,
	track,
	libraryId,
}: CollectionTableMenuProps) => {
	const { user } = Route.useRouteContext();
	const queryClient = useQueryClient();
	const setQueueAndPlay = useAudioStore((state) => state.setQueueAndPlay);
	const addToQueue = useAudioStore((state) => state.addToQueue);

	const { data: library } = useQuery(orpc.library.getLibrary.queryOptions());
	const userLibrary = useMemo(
		() => library?.filter((item) => item.createdByUser),
		[library],
	);

	const handleSongPlay = async (track: Track) => {
		const trackIndex = tracks.findIndex((t) => t.id === track.id) ?? 0;
		await setQueueAndPlay(tracks, trackIndex);
	};

	const { mutate: addToPlaylist } = useMutation(
		orpc.playlist.addToPlaylist.mutationOptions({
			onSuccess: (_data, { playlistId }) => {
				queryClient.invalidateQueries({
					queryKey: orpc.playlist.getById.queryKey({
						input: { id: playlistId },
					}),
				});
			},
		}),
	);

	const { mutate: removeFromPlaylist } = useMutation(
		orpc.playlist.removeFromPlaylist.mutationOptions({
			onSuccess: (_data, { playlistId }) => {
				queryClient.invalidateQueries({
					queryKey: orpc.playlist.getById.queryKey({
						input: { id: playlistId },
					}),
				});
			},
		}),
	);

	const { mutate: toggleLike } = useMutation(
		orpc.song.toggleLike.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.playlist.getLikedTracks.queryKey(),
				});
			},
		}),
	);

	return (
		<Menu>
			<MenuTrigger
				className="invisible group-hover:visible group-focus:visible"
				render={<Button variant="ghost" size="icon-sm" />}
			>
				<MoreIcon />
			</MenuTrigger>
			<MenuPopup align="start" sideOffset={4}>
				<MenuItem onClick={async () => await handleSongPlay(track)}>
					<PlayIcon />
					Play
				</MenuItem>
				<MenuSeparator />

				<MenuItem
					onClick={() => toggleLike({ songId: track.id })}
					disabled={!user}
				>
					<HeartIcon />
					Save in liked
				</MenuItem>

				<MenuSub orientation="horizontal">
					<MenuSubTrigger disabled={!userLibrary || userLibrary.length === 0}>
						<PlusIcon />
						Add to playlist
					</MenuSubTrigger>
					<MenuSubPopup>
						{userLibrary?.map((item) => (
							<MenuItem
								key={item.id}
								onClick={() =>
									addToPlaylist({ playlistId: item.id, songId: track.id })
								}
							>
								{item.name}
							</MenuItem>
						))}
					</MenuSubPopup>
				</MenuSub>

				{libraryId && (
					<MenuItem
						onClick={() =>
							removeFromPlaylist({ playlistId: libraryId, songId: track.id })
						}
					>
						<DeleteIcon />
						Remove from playlist
					</MenuItem>
				)}

				<MenuItem onClick={() => addToQueue(track, "last")}>
					<QueueIcon />
					Add to queue
				</MenuItem>

				<MenuSeparator />

				<MenuItem>
					<ShareIcon />
					Share
				</MenuItem>
			</MenuPopup>
		</Menu>
	);
};
