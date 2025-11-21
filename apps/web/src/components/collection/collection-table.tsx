import { type Track, useAudioStore } from "@opium/audio";
import {
	HeartIcon,
	MoreIcon,
	MusicIcon,
	PlayIcon,
	PlusIcon,
	QueueIcon,
	ShareIcon,
} from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuSub,
	MenuSubPopup,
	MenuSubTrigger,
	MenuTrigger,
} from "@opium/ui/components/menu";
import { Skeleton } from "@opium/ui/components/skeleton";
import { cn } from "@opium/ui/lib/utils";

type CollectionTableProps = {
	tracks: Track[];
	isLoading?: boolean;
};

export const CollectionTable = ({
	tracks,
	isLoading,
}: CollectionTableProps) => {
	const currentTrack = useAudioStore((state) => state.currentTrack);
	const setQueueAndPlay = useAudioStore((state) => state.setQueueAndPlay);
	const addToQueue = useAudioStore((state) => state.addToQueue);

	const handleSongPlay = async (track: Track) => {
		const trackIndex = tracks.findIndex((t) => t.id === track.id) ?? 0;
		await setQueueAndPlay(tracks, trackIndex);
	};

	if (isLoading) {
		return (
			<div className="flex-1 overflow-x-auto">
				<table className="w-full border-separate border-spacing-0">
					<TableHeader />
					<tbody>
						{Array.from({ length: 20 }).map((_, index) => (
							<tr
								key={index}
								className={cn(
									"group transition-colors duration-150",
									index % 2 === 0 && "bg-muted/20",
									"hover:bg-muted/40",
								)}
							>
								<td className="relative pl-0 pr-2">
									<div className="flex items-center justify-center size-7">
										<span className="flex text-sm text-muted-foreground/70">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>
								</td>
								<td className="pl-4 py-1.5">
									<Skeleton className="h-5 w-48" />
								</td>
								<td className="px-4 py-1.5">
									<Skeleton className="h-5 w-32" />
								</td>
								<td className="px-4 py-1.5">
									<Skeleton className="h-5 w-32" />
								</td>
								<td className="px-4 py-1.5">
									<Skeleton className="h-5 w-16" />
								</td>
								<td className="px-4 py-1.5 text-right">
									<Skeleton className="h-5 w-10 ml-auto" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}

	if (tracks.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12 text-center">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted/50 mb-4">
					<MusicIcon className="size-10 text-muted-foreground/50" />
				</div>
				<h3 className="text-lg font-semibold">No songs found</h3>
				<p className="text-sm text-muted-foreground mt-2 max-w-sm">
					This collection appears to be empty. Try adding some songs or check
					back later.
				</p>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-y-auto">
			<table className="w-full border-separate border-spacing-0">
				<TableHeader />
				<tbody>
					{tracks.map((track, index) => (
						<tr
							key={track.id}
							className={cn(
								"group transition-colors duration-150",
								index % 2 === 0 && "bg-muted/20",
								"hover:bg-muted/40",
							)}
						>
							<td className="relative pl-0 pr-2">
								{currentTrack?.id === track.id ? (
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
											variant="ghost"
											size="icon-sm"
											className="hidden group-hover:flex group-focus:flex"
											onClick={async () => await handleSongPlay(track)}
											aria-label={`Play ${track.title}`}
										>
											<PlayIcon />
										</Button>
									</div>
								)}
							</td>
							<td className="pl-4 py-1.5">
								<div className="flex items-center justify-between gap-3">
									<p className="text-sm text-foreground truncate line-clamp-1">
										{track.title}
									</p>
									{/* <LikeButton
												isLiked={isLiked}
												onClick={() => setIsLiked(!isLiked)}
											/> */}
								</div>
							</td>
							<td className="px-4 py-1.5">
								<p className="text-sm text-muted-foreground">{track.artist}</p>
							</td>
							<td className="px-4 py-1.5">
								<p className="text-sm text-muted-foreground">{track.album}</p>
							</td>
							<td className="px-4 py-1.5">
								<p className="text-sm text-muted-foreground">
									{track.type.charAt(0).toUpperCase() + track.type.slice(1)}
								</p>
							</td>
							<td className="px-4 pr-1 py-0.5 text-right flex items-center justify-between gap-1">
								<p className="text-sm text-muted-foreground/70">
									{`${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, "0")}`}
								</p>
								<Menu>
									<MenuTrigger
										className="invisible group-hover:visible group-focus:visible"
										render={<Button variant="ghost" size="icon-sm" />}
									>
										<MoreIcon />
									</MenuTrigger>
									<MenuPopup align="start" sideOffset={4}>
										<MenuItem onClick={async () => await handleSongPlay(track)}>
											<PlayIcon />
											Play
										</MenuItem>
										<MenuSeparator />

										<MenuItem>
											<HeartIcon />
											Save in liked
										</MenuItem>

										<MenuSub orientation="horizontal">
											<MenuSubTrigger>
												<PlusIcon />
												Add to playlist
											</MenuSubTrigger>
											<MenuSubPopup>
												<MenuItem>Favorites</MenuItem>
												<MenuItem>Jazz</MenuItem>
												<MenuItem>Rock</MenuItem>
											</MenuSubPopup>
										</MenuSub>

										<MenuItem onClick={() => addToQueue(track, "last")}>
											<QueueIcon />
											Add to queue
										</MenuItem>

										<MenuSeparator />

										<MenuItem>
											<ShareIcon />
											Share
										</MenuItem>
									</MenuPopup>
								</Menu>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

const TableHeader = () => {
	return (
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
	);
};
