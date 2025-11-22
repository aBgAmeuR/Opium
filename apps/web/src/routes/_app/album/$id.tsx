import { type Track, useAudioStore } from "@opium/audio";
import { ShuffleIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import {
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
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

export const Route = createFileRoute("/_app/album/$id")({
	component: AlbumComponent,
});

function AlbumComponent() {
	const { user } = Route.useRouteContext();
	const { id } = Route.useParams();
	const queryClient = useQueryClient();
	const setQueueAndPlay = useAudioStore((state) => state.setQueueAndPlay);

	const { data: album } = useSuspenseQuery(
		orpc.album.getById.queryOptions({ input: { id: Number(id) } }),
	);

	const { data: songs, isLoading } = useQuery(
		orpc.album.getSongs.queryOptions({ input: { id: Number(id) } }),
	);

	const { mutate: toggleLike } = useMutation(
		orpc.album.toggleLike.mutationOptions({
			onMutate: async () => {
				const albumQueryKey = orpc.album.getById.queryKey({
					input: { id: Number(id) },
				});
				await queryClient.cancelQueries({ queryKey: albumQueryKey });

				const previousAlbum = queryClient.getQueryData(albumQueryKey);

				queryClient.setQueryData(albumQueryKey, (old) =>
					old ? { ...old, liked: !old.liked } : undefined,
				);

				return { previousAlbum };
			},
			onSettled: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.album.getById.queryKey({ input: { id: Number(id) } }),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.library.getLibrary.queryKey(),
				});
			},
		}),
	);

	const tracks: Track[] =
		songs?.map((s) => ({
			...s,
			album: album.name,
			artwork: album.cover,
		})) ?? [];

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
					{ icon: "album", label: "Albums", href: "/" },
					{ label: album.name },
				]}
			>
				<Button variant="secondary" size="sm" onClick={handlePlayAll}>
					Play All
				</Button>
				<Button variant="ghost" size="icon-sm" onClick={handlePlayAllShuffle}>
					<ShuffleIcon />
				</Button>
				{user && (
					<LikeButton
						isLiked={album.liked ?? false}
						onClick={() => toggleLike({ albumId: album.id })}
					/>
				)}
			</CollectionNav>

			<CollectionHero>
				<CollectionHeroImage imageSrc={album.cover} imageAlt={album.name} />
				<CollectionHeroInfo title={album.name} subtitle="Album">
					<Button
						variant="link"
						size="sm"
						className="p-0 text-foreground"
						render={
							<Link
								to="/album/$id"
								params={{ id: album.artistId.toString() }}
							/>
						}
					>
						{album.artistName}
					</Button>
					<span>•</span>
					<span>
						{album.totalSongs ?? 0} song
						{(album.totalSongs ?? 0) !== 1 ? "s" : ""}
					</span>
				</CollectionHeroInfo>
			</CollectionHero>

			<CollectionTable tracks={tracks} isLoading={isLoading} />
		</Collection>
	);
}
