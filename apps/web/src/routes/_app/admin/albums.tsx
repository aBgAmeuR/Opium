import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AlbumsTable } from "@/features/albums/components/albums-table";
import { NewAlbum } from "@/features/albums/components/new-album";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/admin/albums")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: albums, isLoading } = useQuery(orpc.album.list.queryOptions());

	return (
		<main className="flex flex-col gap-4 p-6">
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-2xl tracking-tight">Manage Albums</h1>
				<NewAlbum />
			</div>
			<AlbumsTable albums={albums ?? []} isLoading={isLoading} />
		</main>
	);
}
