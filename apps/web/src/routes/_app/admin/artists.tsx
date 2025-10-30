import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArtistsTable } from "@/features/artists/components/artists-table";
import { NewArtist } from "@/features/artists/components/new-artist";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/admin/artists")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: artists, isLoading } = useQuery(
		orpc.artist.list.queryOptions(),
	);

	return (
		<main className="flex flex-col gap-4 p-6">
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-2xl tracking-tight">Manage Artists</h1>
				<NewArtist />
			</div>
			<ArtistsTable artists={artists ?? []} isLoading={isLoading} />
		</main>
	);
}
