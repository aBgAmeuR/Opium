import {
	AlbumIcon,
	ArrowLeftIcon,
	ArrowRightIcon,
	HeartAddIcon,
	HeartCheckIcon,
	HeartIcon,
	PlayIcon,
	ShuffleIcon,
} from "@opium/icons";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@opium/ui/components/breadcrumb";
import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import { cn } from "@opium/ui/lib/utils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
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

	const isCurrentTrack = true;

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
		<div className="px-6 py-4">
			<div className="flex items-center justify-between mb-4 -mx-2">
				<div className="flex items-center gap-4">
					<div className="flex items-center">
						<Button variant="ghost" size="icon-sm">
							<ArrowLeftIcon />
						</Button>
						<Button variant="ghost" size="icon-sm" disabled>
							<ArrowRightIcon />
						</Button>
					</div>

					<Breadcrumb>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<AlbumIcon className="size-4" />
									<BreadcrumbLink render={<Link to="/" />}>
										Albums
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator> / </BreadcrumbSeparator>
								<BreadcrumbItem>
									<BreadcrumbPage>{album.name}</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</Breadcrumb>
				</div>
				<div className="flex items-center gap-1">
					<Button variant="secondary" size="sm">
						Play All
					</Button>
					<Button variant="ghost" size="icon-sm">
						<ShuffleIcon />
					</Button>
					<Button variant="ghost" size="icon-sm" onClick={handleLike}>
						{isLiked ? (
							<HeartIcon className="text-red-500" />
						) : (
							<HeartAddIcon />
						)}
					</Button>
				</div>
			</div>

			<div className="mb-4 flex gap-4">
				<Cover
					size="lg"
					variant="blur"
					imageSrc={album.cover}
					alt={album.name}
				/>

				<div className="flex flex-col justify-end">
					<p className="mb-1 text-sm text-muted-foreground">Album</p>
					<h1 className="text-4xl font-bold">{album.name}</h1>
					<div className="flex items-center gap-1 text-sm text-muted-foreground">
						<Button
							variant="link"
							size="sm"
							className="p-0 text-foreground"
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
						<span>
							{album.totalSongs ?? 0} song
							{(album.totalSongs ?? 0) !== 1 ? "s" : ""}
						</span>
					</div>
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
											{isCurrentTrack ? (
												<div className="mx-auto flex size-[0.65rem] items-end justify-center space-x-0.5">
													<div className="animate-now-playing-1 w-1 bg-muted-foreground"></div>
													<div className="animate-now-playing-2 w-1 bg-muted-foreground [animation-delay:0.2s]"></div>
													<div className="animate-now-playing-3 w-1 bg-muted-foreground [animation-delay:0.4s]"></div>
												</div>
											) : (
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
														<PlayIcon />
													</Button>
												</div>
											)}
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
													{likedSongs.has(song.id) ? (
														<HeartIcon className="text-red-500" />
													) : (
														<HeartAddIcon />
													)}
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
