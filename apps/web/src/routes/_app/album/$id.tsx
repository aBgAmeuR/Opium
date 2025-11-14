import { Button } from "@opium/ui/components/button";
import { cn } from "@opium/ui/lib/utils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Heart, MoreVertical, MusicIcon, Play, Shuffle } from "lucide-react";
import { useState } from "react";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/album/$id")({
	component: AlbumComponent,
});

function AlbumComponent() {
	const { id } = Route.useParams();
	const [isLiked, setIsLiked] = useState(false);

	const { data: album } = useSuspenseQuery(
		orpc.album.getById.queryOptions({
			input: { id: Number(id) },
		}),
	);

	const { data: songs, isLoading: isLoadingSongs } = useQuery(
		orpc.album.getSongs.queryOptions({
			input: { id: Number(id) },
		}),
	);

	const handlePlay = () => {
		// TODO: Implement play functionality
		console.log("Play album:", album.name);
	};

	const handleLike = () => {
		// TODO: Implement like functionality
		setIsLiked(!isLiked);
	};

	return (
		<div className="container p-6">
			<div className="mb-6 flex gap-6">
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
					<p className="mb-2 text-sm text-muted-foreground">Album</p>
					<h1 className="mb-2 text-5xl font-bold">{album.name}</h1>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<div className="flex items-center">
							<Image
								src={album.artistImage}
								alt={album.artistName}
								className="size-6 object-cover rounded-full"
								width={24}
								height={24}
							/>
							<Button
								variant="link"
								size="sm"
								className="text-foreground"
								render={
									<Link
										// TODO: Temporary link to artist page
										to="/album/$id"
										params={{ id: album.artistId.toString() }}
									/>
								}
							>
								{album.artistName}
							</Button>
							<span>•</span>
						</div>
						<span>
							{album.totalSongs ?? 0} song
							{(album.totalSongs ?? 0) !== 1 ? "s" : ""}
						</span>
					</div>
				</div>
			</div>

			<div className="mb-6 flex items-center gap-3">
				<Button
					variant="default"
					size="icon-lg"
					onClick={handlePlay}
					className="rounded-full shadow-none-none"
				>
					<Play className="ml-1 size-6 fill-current" />
				</Button>
				<div className="flex items-center gap-0">
					<Button variant="ghost" size="icon-lg" aria-label="Shuffle button">
						<Shuffle className="size-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon-lg"
						onClick={handleLike}
						aria-label={isLiked ? "Unlike album" : "Like album"}
					>
						<Heart
							className={cn(
								"size-5",
								isLiked ? "fill-current text-red-500" : "",
							)}
						/>
					</Button>
					<Button variant="ghost" size="icon-lg" aria-label="More options">
						<MoreVertical className="size-5" />
					</Button>
				</div>
			</div>

			{songs && songs.length > 0 && (
				<div className="space-y-1">
					{songs.map((song, index) => {
						const minutes = Math.floor(song.length / 60);
						const seconds = song.length % 60;
						const formattedLength = `${minutes}:${seconds.toString().padStart(2, "0")}`;

						return (
							<div
								key={song.id}
								className="flex items-center gap-4 rounded-md px-3 py-2 hover:bg-muted/50"
							>
								<span className="w-4 text-sm text-muted-foreground">
									{index + 1}
								</span>
								<div className="flex-1">
									<p className="text-sm font-medium">{song.title}</p>
									<p className="text-xs text-muted-foreground">
										{song.artistName}
									</p>
								</div>
								<span className="text-xs text-muted-foreground">
									{formattedLength}
								</span>
							</div>
						);
					})}
				</div>
			)}

			{isLoadingSongs && (
				<div className="text-sm text-muted-foreground">Loading songs...</div>
			)}

			{!isLoadingSongs && songs && songs.length === 0 && (
				<div className="text-sm text-muted-foreground">
					No songs in this album
				</div>
			)}
		</div>
	);
}
