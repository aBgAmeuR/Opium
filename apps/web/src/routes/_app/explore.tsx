import { Button } from "@opium/ui/components/button";
import { ScrollArea } from "@opium/ui/components/scroll-area";
import { cn } from "@opium/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CatalogCard, CatalogCardSkeleton } from "@/components/catalog/card";
import { types } from "@/constants/types";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/explore")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: albums, isLoading } = useQuery(orpc.album.list.queryOptions());
	const { data: songs, isLoading: isSongsLoading } = useQuery(
		orpc.song.getLatest.queryOptions({ input: { limit: 10 } }),
	);
	const navigate = useNavigate();

	return (
		<main className="flex flex-col gap-4 p-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Explore</h1>
				<p className="text-muted-foreground text-sm">
					Discover new tracks, leaks, and unreleased music
				</p>
			</div>
			<div>
				<h2 className="font-bold text-lg tracking-tight">Browse by Type</h2>
				<div className="mt-2 grid grid-cols-4 gap-2 lg:grid-cols-5 xl:grid-cols-6">
					{types.map((type) => (
						<Button
							className={cn(
								type.color,
								"flex aspect-video w-full flex-col items-center justify-center gap-1.5 text-white",
							)}
							key={type.name}
							variant="ghost"
						>
							{type.icon}
							<p className="font-medium tracking-tight">{type.name}</p>
						</Button>
					))}
				</div>
			</div>
			<div>
				<h2 className="font-bold text-lg tracking-tight">Latest Songs</h2>
				<ScrollArea orientation="horizontal">
					<div className="flex">
						{songs?.map((song) => (
							<CatalogCard
								key={song.id}
								description={song.artist}
								imageSrc={song.cover}
								name={song.title}
								type={song.type}
							/>
						))}
						{isSongsLoading && (
							<div className="flex">
								{Array.from({ length: 8 }).map((_, index) => (
									<CatalogCardSkeleton key={index} />
								))}
							</div>
						)}
					</div>
				</ScrollArea>
			</div>
			<div>
				<h2 className="font-bold text-lg tracking-tight">Albums</h2>
				<ScrollArea orientation="horizontal">
					<div className="flex">
						{albums?.map((album) => (
							<CatalogCard
								key={album.id}
								description={album.artistName}
								imageSrc={album.cover}
								name={album.name}
								onClick={() =>
									navigate({
										to: "/album/$id",
										params: { id: album.id.toString() },
									})
								}
							/>
						))}
						{isLoading && (
							<div className="flex">
								{Array.from({ length: 8 }).map((_, index) => (
									<CatalogCardSkeleton key={index} />
								))}
							</div>
						)}
					</div>
				</ScrollArea>
			</div>
		</main>
	);
}
