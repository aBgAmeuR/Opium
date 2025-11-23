import { type Track, useAudioStore } from "@opium/audio";
import { ShuffleIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import {
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Collection,
	CollectionHero,
	CollectionHeroImage,
	CollectionHeroInfo,
	CollectionNav,
	CollectionTable,
} from "@/components/collection";
import { LikeButton } from "@/components/like-button";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/playlist/$id")({
	component: PlaylistComponent,
});

function PlaylistComponent() {
	const { user } = Route.useRouteContext();
	const { id } = Route.useParams();
	const queryClient = useQueryClient();
	const setQueueAndPlay = useAudioStore((state) => state.setQueueAndPlay);

	const { data: playlist } = useSuspenseQuery(
		orpc.playlist.getById.queryOptions({ input: { id: Number(id) } }),
	);

	const { data: tracks = [], isLoading } = useQuery(
		orpc.playlist.getSongs.queryOptions({ input: { id: Number(id) } }),
	);

	const { mutate: toggleLike } = useMutation(
		orpc.playlist.toggleLike.mutationOptions({
			onMutate: async () => {
				const playlistQueryKey = orpc.playlist.getById.queryKey({
					input: { id: Number(id) },
				});
				await queryClient.cancelQueries({ queryKey: playlistQueryKey });

				const previousPlaylist = queryClient.getQueryData(playlistQueryKey);

				queryClient.setQueryData(playlistQueryKey, (old) =>
					old ? { ...old, liked: !old.liked } : undefined,
				);

				return { previousPlaylist };
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.playlist.getById.queryKey({
						input: { id: Number(id) },
					}),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.library.getLibrary.queryKey(),
				});
			},
		}),
	);

	const handlePlayAll = async () => {
		await setQueueAndPlay(tracks, 0);
	};

	const handlePlayAllShuffle = async () => {
		const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
		await setQueueAndPlay(shuffledTracks, 0);
	};

	return (
		<Collection>
			<CollectionNav
				breadcrumbs={[
					{ icon: "playlist", label: "Playlists", href: "/" },
					{ label: playlist.name },
				]}
			>
				<Button variant="secondary" size="sm" onClick={handlePlayAll}>
					Play All
				</Button>
				<Button variant="ghost" size="icon-sm" onClick={handlePlayAllShuffle}>
					<ShuffleIcon />
				</Button>
				{user && playlist.userId !== user?.id && (
					<LikeButton
						isLiked={playlist.liked ?? false}
						onClick={() => toggleLike({ playlistId: playlist.id })}
					/>
				)}
			</CollectionNav>

			<CollectionHero>
				<CollectionHeroImage src={playlist.image} alt={playlist.name} />
				<CollectionHeroInfo
					title={playlist.name}
					subtitle={`${playlist.visibility} Playlist`}
				>
					<span>
						{playlist.totalSongs ?? 0} song
						{(playlist.totalSongs ?? 0) !== 1 ? "s" : ""}
					</span>
					<span>•</span>
					<span>{playlist.createdAt.toLocaleDateString()}</span>
				</CollectionHeroInfo>
			</CollectionHero>

			<CollectionTable
				tracks={tracks}
				isLoading={isLoading}
				showCover
				libraryId={playlist.userId === user?.id ? playlist.id : undefined}
			/>
		</Collection>
	);
}
