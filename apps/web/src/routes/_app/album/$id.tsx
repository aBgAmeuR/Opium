import { useAudioStore } from "@opium/audio";
import {
	AlbumIcon,
	HeartAddIcon,
	HeartIcon,
	PlayIcon,
	ShuffleIcon,
} from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import { cn } from "@opium/ui/lib/utils";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { orpc } from "@/utils/orpc";

type SongId = string;

export const Route = createFileRoute("/_app/album/$id")({
	component: AlbumComponent,
});

function AlbumComponent() {
	const { id } = Route.useParams();
	const [isLiked, setIsLiked] = useState(false);
	const [likedSongs, setLikedSongs] = useState<Set<SongId>>(new Set());
	const setQueueAndPlay = useAudioStore((state) => state.setQueueAndPlay);
	const currentTrack = useAudioStore((state) => state.currentTrack);

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

	const handleLike = () => {
		setIsLiked(!isLiked);
	};

	const handleSongPlay = async (song: NonNullable<typeof songs>[number]) => {
		const queue = songs?.map((s) => ({
			id: s.id,
			title: s.title,
			artist: s.artistName,
			artwork: album.cover,
			url: s.fileUrl,
			album: album.name,
			albumId: album.id,
			artistId: album.artistId,
			type: s.type,
			duration: s.length,
		}));

		if (!queue) return;
		const songIndex = queue.findIndex((s) => s.id === song.id) ?? 0;

		await setQueueAndPlay(queue, songIndex);
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
		<div className="flex h-full flex-col px-6 py-4">
			<PageHeader
				breadcrumbs={[
					{
						icon: <AlbumIcon className="size-4" />,
						label: "Albums",
						href: "/",
					},
					{
						label: album.name,
					},
				]}
			>
				<Button variant="secondary" size="sm">
					Play All
				</Button>
				<Button variant="ghost" size="icon-sm">
					<ShuffleIcon />
				</Button>
				<Button variant="ghost" size="icon-sm" onClick={handleLike}>
					{isLiked ? <HeartIcon className="text-red-500" /> : <HeartAddIcon />}
				</Button>
			</PageHeader>

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
				<div className="flex-1 overflow-x-auto">
					<table className="w-full border-separate border-spacing-0">
						<thead className="sticky top-0 z-10 bg-background">
							<tr>
								<th className="w-7 pl-0 pr-2 py-2 text-center text-xs font-normal text-muted-foreground/60">
									#
								</th>
								<th className="px-4 py-2 text-left text-xs font-normal text-muted-foreground/60">
									Name
								</th>
								<th className="px-4 py-2 text-left text-xs font-normal text-muted-foreground/60">
									Artists
								</th>
								<th className="px-4 py-2 text-left text-xs font-normal text-muted-foreground/60">
									Release
								</th>
								<th className="px-4 py-2 text-left text-xs font-normal text-muted-foreground/60">
									Type
								</th>
								<th className="w-20 px-4 py-2 text-right text-xs font-normal text-muted-foreground/60">
									Duration
								</th>
							</tr>
						</thead>
						<tbody>
							{songs.map((song, index) => {
								const minutes = Math.floor(song.length / 60);
								const seconds = song.length % 60;
								const formattedLength = `${minutes}:${seconds.toString().padStart(2, "0")}`;
								const isEven = index % 2 === 0;

								return (
									<tr
										key={song.id}
										className={cn(
											"group transition-colors duration-150",
											isEven && "bg-muted/20",
											"hover:bg-muted/40",
										)}
									>
										<td className="relative pl-0 pr-2">
											{currentTrack?.id === song.id ? (
												<div className="mx-auto flex size-[0.65rem] items-end justify-center space-x-0.5">
													<div className="animate-now-playing-1 w-1 bg-primary"></div>
													<div className="animate-now-playing-2 w-1 bg-primary [animation-delay:0.2s]"></div>
													<div className="animate-now-playing-3 w-1 bg-primary [animation-delay:0.4s]"></div>
												</div>
											) : (
												<div className="flex items-center justify-center size-7">
													<span className="flex group-hover:hidden group-focus::hidden text-sm text-muted-foreground/70">
														{String(index + 1).padStart(2, "0")}
													</span>
													<Button
														variant="link"
														size="icon"
														className="hidden group-hover:flex group-focus:flex"
														onClick={async () => await handleSongPlay(song)}
														aria-label={`Play ${song.title}`}
													>
														<PlayIcon />
													</Button>
												</div>
											)}
										</td>
										<td className="pl-4 py-1.5">
											<div className="flex items-center justify-between gap-3">
												<p className="text-sm text-foreground group-hover:text-foreground transition-colors">
													{song.title}
												</p>
												<Button
													variant="ghost"
													size="icon-sm"
													className={cn(
														"h-6 w-6 transition-opacity",
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
														<HeartIcon className="size-4 text-red-500" />
													) : (
														<HeartAddIcon className="size-4" />
													)}
												</Button>
											</div>
										</td>
										<td className="px-4 py-1.5">
											<p className="text-sm text-muted-foreground/80">
												{song.artistName}
											</p>
										</td>
										<td className="px-4 py-1.5">
											<p className="text-sm text-muted-foreground/80">
												{album.name}
											</p>
										</td>
										<td className="px-4 py-1.5">
											<p className="text-sm text-muted-foreground/80">
												{song.type.charAt(0).toUpperCase() + song.type.slice(1)}
											</p>
										</td>
										<td className="px-4 py-1.5 text-right">
											<p className="text-sm text-muted-foreground/70">
												{formattedLength}
											</p>
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
