import { Button } from "@opium/ui/components/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from
";

import { CatalogCard, CatalogCardSkeleton } from "@/components/catalog/card";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/library")({
	component: LibraryComponent,
});

function LibraryComponent() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const library = useQuery(orpc.library.getLibrary.queryOptions());

	const createPlaylistMutation = useMutation(
		orpc.playlist.create.mutationOptions({
			onSuccess: (data) => {
				// queryClient.invalidateQueries({
				// 	queryKey: orpc.playlist.getOwnPlaylists.queryKey(),
				// });
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
					{/* <CatalogCardList
						data={(library.data ?? []).sort((a, b) => b.likedAt.getTime() - a.likedAt.getTime()).map((playlist) => ({
							id: playlist.id.toString(),
							name: playlist.name,
							description: `${playlist.totalSongs ?? 0} song${(playlist.totalSongs ?? 0) !== 1 ? "s" : ""}`,
							image: playlist.image ?? undefined,
						}))}
						isLoading={library.isLoading}
						emptyMessage="No items in your library"
						onClick={(id) => navigate({ to: "/playlist/$id", params: { id } })}
					/> */}
					{library.isLoading && (
						<div className="flex">
							{Array.from({ length: 4 }).map((_, index) => (
								<CatalogCardSkeleton key={index} />
							))}
						</div>
					)}
					<div className="flex">
						{library.data
							?.sort((a, b) => b.likedAt.getTime() - a.likedAt.getTime())
							?.map((item) => (
								<CatalogCard
									key={item.id}
									onClick={() =>
										navigate({
											to: "/playlist/$id",
											params: { id: item.id.toString() },
										})
									}
									name={item.name}
									description={`${item.totalSongs} song${item.totalSongs !== 1 ? "s" : ""}`}
									imageSrc={item.image ?? undefined}
								/>
							))}
					</div>
					{library.data?.length === 0 && (
						<div className="text-muted-foreground text-sm">
							No items in your library
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
