import { Button } from "@opium/ui/components/button";
import { cn } from "@opium/ui/lib/utils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Heart, MoreVertical, MusicIcon, Play, Shuffle } from "lucide-react";
import { useState } from "react";
import { orpc } from "@/utils/orpc";

type SongId = string;

export const Route = createFileRoute("/_app/album/$id")({
	component: AlbumComponent,
});

function AlbumComponent() {
	const { id } = Route.useParams();
	const [isLiked, setIsLiked] = useState(false);
	const [likedSongs, setLikedSongs] = useState<Set<SongId>>(new Set());
	const [playingSongId, setPlayingSongId] = useState<SongId | null>(null);

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

	const handleSongPlay = (songId: SongId) => {
		// TODO: Implement play functionality
		console.log("Play song:", songId);
		setPlayingSongId(songId);
	};

	const handleSongLike = (songId: SongId) => {
		// TODO: Implement like functionality
		setLikedSongs((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(songId)) {
				newSet.delete(songId);
			} else {
				newSet.add(songId);
			}
			return newSet;
		});
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
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-border">
								<th className="w-12 px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
									#
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
									Name
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
									Artists
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
									Type
								</th>
								<th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">
									Release
								</th>
								<th className="w-20 px-4 py-3 text-right text-xs font-medium uppercase text-muted-foreground">
									Duration
								</th>
							</tr>
						</thead>
						<tbody>
							{songs.map((song, index) => {
								const minutes = Math.floor(song.length / 60);
								const seconds = song.length % 60;
								const formattedLength = `${minutes}:${seconds.toString().padStart(2, "0")}`;

								return (
									<tr
										key={song.id}
										className="group border-border/50 hover:bg-muted/50 transition-colors"
									>
										<td className="relative px-4 py-1">
											<div className="flex items-center justify-center">
												<span className="group-hover:invisible text-sm text-muted-foreground">
													{String(index + 1).padStart(2, "0")}
												</span>
												<Button
													variant="ghost"
													size="icon-sm"
													className="absolute invisible group-hover:visible"
													onClick={() => handleSongPlay(song.id)}
													aria-label={`Play ${song.title}`}
												>
													<Play className="size-4 fill-current" />
												</Button>
											</div>
										</td>
										<td className="pl-4 py-1">
											<div className="flex items-center justify-between">
												<p className="text-sm font-medium">{song.title}</p>
												<Button
													variant="ghost"
													size="icon-sm"
													className={cn(
														"transition-opacity",
														likedSongs.has(song.id)
															? "opacity-100"
															: "opacity-0 group-hover:opacity-100",
													)}
													onClick={() => handleSongLike(song.id)}
													aria-label={
														likedSongs.has(song.id)
															? `Unlike ${song.title}`
															: `Like ${song.title}`
													}
												>
													<Heart
														className={cn(
															"size-4",
															likedSongs.has(song.id)
																? "fill-current text-red-500"
																: "",
														)}
													/>
												</Button>
											</div>
										</td>
										<td className="pr-4 py-1 pl-2">
											<p className="text-sm text-muted-foreground">
												{song.artistName}
											</p>
										</td>
										<td className="px-4 py-1">
											<p className="text-sm text-muted-foreground">
												{song.type.charAt(0).toUpperCase() + song.type.slice(1)}
											</p>
										</td>
										<td className="px-4 py-1">
											<p className="text-sm text-muted-foreground">
												{album.name}
											</p>
										</td>
										<td className="px-4 py-1 text-right text-sm text-muted-foreground">
											{formattedLength}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
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
