import { Button } from "@opium/ui/components/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { CatalogCard, CatalogCardSkeleton } from "@/components/catalog-card";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/library")({
	component: LibraryComponent,
});

function LibraryComponent() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const ownPlaylists = useQuery(orpc.playlist.getOwnPlaylists.queryOptions());
	const likedPlaylists = useQuery(
		orpc.playlist.getLikedPlaylists.queryOptions(),
	);
	const likedAlbums = useQuery(orpc.playlist.getLikedAlbums.queryOptions());

	const createPlaylistMutation = useMutation(
		orpc.playlist.create.mutationOptions({
			onSuccess: (data) => {
				queryClient.invalidateQueries({
					queryKey: orpc.playlist.getOwnPlaylists.queryKey(),
				});
				if (data) {
					navigate({ to: "/playlist/$id", params: { id: data.id.toString() } });
				}
			},
		}),
	);

	const handleCreatePlaylist = () => {
		createPlaylistMutation.mutate(undefined);
	};

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="font-bold text-3xl">My Library</h1>
				<Button
					onClick={handleCreatePlaylist}
					disabled={createPlaylistMutation.isPending}
				>
					<Plus className="size-4" />
					Create Playlist
				</Button>
			</div>

			<div className="flex flex-col gap-8">
				<section>
					<h2 className="mb-4 font-semibold text-xl">My Playlists</h2>
					<CatalogCardList
						data={(ownPlaylists.data ?? []).map((playlist) => ({
							id: playlist.id.toString(),
							name: playlist.name,
							description: `${playlist.totalSongs ?? 0} song${(playlist.totalSongs ?? 0) !== 1 ? "s" : ""}`,
							image: playlist.image ?? undefined,
						}))}
						isLoading={ownPlaylists.isLoading}
						emptyMessage="No playlists created"
						onClick={(id) => navigate({ to: "/playlist/$id", params: { id } })}
					/>
				</section>

				<section>
					<h2 className="mb-4 font-semibold text-xl">Liked Playlists</h2>
					<CatalogCardList
						data={(likedPlaylists.data ?? []).map((playlist) => ({
							id: playlist.id.toString(),
							name: playlist.name,
							description: `${playlist.totalSongs ?? 0} song${(playlist.totalSongs ?? 0) !== 1 ? "s" : ""}`,
							image: playlist.image ?? undefined,
						}))}
						isLoading={likedPlaylists.isLoading}
						emptyMessage="No liked playlists"
						onClick={(id) => navigate({ to: "/playlist/$id", params: { id } })}
					/>
				</section>

				<section>
					<h2 className="mb-4 font-semibold text-xl">Liked Albums</h2>
					<CatalogCardList
						data={(likedAlbums.data ?? []).map((album) => ({
							id: album.id.toString(),
							name: album.name,
							description: `${album.totalSongs ?? 0} song${(album.totalSongs ?? 0) !== 1 ? "s" : ""}`,
							image: album.cover ?? undefined,
						}))}
						isLoading={likedAlbums.isLoading}
						emptyMessage="No liked albums"
					/>
				</section>
			</div>
		</div>
	);
}

type CatalogCardListProps = {
	data: Array<{
		id: string;
		name: string;
		image?: string;
		description: string;
	}>;
	onClick?: (id: string) => void;
	isLoading: boolean;
	emptyMessage: string;
};

const CatalogCardList = ({
	data,
	onClick,
	isLoading,
	emptyMessage,
}: CatalogCardListProps) => {
	if (isLoading) {
		return (
			<div className="flex">
				{Array.from({ length: 4 }).map((_, index) => (
					<CatalogCardSkeleton key={index} />
				))}
			</div>
		);
	}

	if (data && data.length > 0) {
		return (
			<div className="flex">
				{data.map((item) => (
					<CatalogCard
						key={item.id}
						onClick={() => onClick?.(item.id)}
						name={item.name}
						description={item.description}
						imageSrc={item.image ?? undefined}
					/>
				))}
			</div>
		);
	}

	return <div className="text-muted-foreground text-sm">{emptyMessage}</div>;
};
