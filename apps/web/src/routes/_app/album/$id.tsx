import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { MusicIcon } from "lucide-react";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/album/$id")({
	component: AlbumComponent,
});

function AlbumComponent() {
	const { id } = Route.useParams();

	const { data: album } = useSuspenseQuery(
		orpc.album.getById.queryOptions({
			input: { id: Number(id) },
		}),
	);

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			<div className="mb-8 flex gap-6">
				<div className="relative size-48 flex-shrink-0">
					{album.cover ? (
						<Image
							src={album.cover}
							alt={album.name}
							className="size-48 object-cover rounded-[4px]"
							width={192}
							height={192}
						/>
					) : (
						<div className="flex size-48 items-center justify-center rounded-[4px] bg-muted text-muted-foreground">
							<MusicIcon className="size-8" />
						</div>
					)}
				</div>

				<div className="flex flex-col justify-end">
					<p className="mb-2 text-sm text-muted-foreground">
						Album • {album.artistName}
					</p>
					<h1 className="mb-4 text-5xl font-bold">{album.name}</h1>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<span>
							{album.totalSongs ?? 0} song
							{(album.totalSongs ?? 0) !== 1 ? "s" : ""}
						</span>
						<span>•</span>
						<span>{new Date(album.createdAt).toLocaleDateString()}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
