import { type Track, useAudioStore } from "@opium/audio";
import {
	ExploreIcon,
	HeartIcon,
	MoreIcon,
	MusicIcon,
	PlayIcon,
	PlusIcon,
	QueueIcon,
	ShareIcon,
} from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@opium/ui/components/empty";
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
import { ScrollArea } from "@opium/ui/components/scroll-area";
import { Skeleton } from "@opium/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@opium/ui/components/table";
import { cn } from "@opium/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { LikeButton } from "../like-button";

type CollectionTableProps = {
	tracks: Track[];
	isLoading?: boolean;
	showCover?: boolean;
};

export const CollectionTable = ({
	tracks,
	isLoading,
	showCover = false,
}: CollectionTableProps) => {
	const currentTrack = useAudioStore((state) => state.currentTrack);
	const setQueueAndPlay = useAudioStore((state) => state.setQueueAndPlay);
	const addToQueue = useAudioStore((state) => state.addToQueue);
	const isPlaying = useAudioStore((state) => state.isPlaying);

	const handleSongPlay = async (track: Track) => {
		const trackIndex = tracks.findIndex((t) => t.id === track.id) ?? 0;
		await setQueueAndPlay(tracks, trackIndex);
	};

	if (isLoading) {
		return (
			<ScrollArea className="flex-1" orientation="both">
				<Table className="border-separate border-spacing-0 table-fixed w-full">
					<CollectionTableHeader />
					<TableBody>
						{Array.from({ length: 20 }).map((_, index) => (
							<TableRow
								key={`skeleton-${index}`}
								className={cn(
									"group transition-colors duration-150",
									index % 2 === 0 && "bg-muted/20",
									"hover:bg-muted/40",
								)}
							>
								<TableCell className="relative py-0">
									<div className="flex items-center justify-center size-7">
										<span className="flex text-sm text-muted-foreground/70">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>
								</TableCell>
								<TableCell className="text-sm py-1 min-w-0 max-w-0">
									<div className="flex items-center gap-2 min-w-0 flex-1">
										{showCover && <Skeleton className="size-6" />}
										<Skeleton
											className="h-4 my-0.5"
											style={{
												width: `${Math.floor((Math.abs(Math.sin(index + 1)) * 10000) % 41) + 40}%`,
											}}
										/>
									</div>
								</TableCell>
								<TableCell className="text-sm text-muted-foreground hidden md:table-cell">
									<Skeleton className="w-[80%] h-4 my-0.5" />
								</TableCell>
								<TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
									<Skeleton className="w-[80%] h-4 my-0.5" />
								</TableCell>
								<TableCell className="text-sm text-muted-foreground hidden xl:table-cell">
									<Skeleton className="w-[80%] h-4 my-0.5" />
								</TableCell>
								<TableCell className="pr-1 py-1 text-right flex items-center justify-end gap-1">
									<Skeleton className="w-8 h-4 my-0.5" />
									<div className="size-7" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</ScrollArea>
		);
	}

	if (tracks.length === 0) {
		return (
			<>
				<Table className="border-separate border-spacing-0 table-fixed w-full">
					<CollectionTableHeader />
				</Table>
				<Empty className="p-0 md:p-0 mb-12">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<MusicIcon />
						</EmptyMedia>
						<EmptyTitle>No songs found</EmptyTitle>
						<EmptyDescription>
							This collection appears to be empty. Try adding some songs or
							check back later.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button variant="default" size="sm" render={<Link to="/explore" />}>
							<ExploreIcon />
							Explore music
						</Button>
					</EmptyContent>
				</Empty>
			</>
		);
	}

	return (
		<ScrollArea className="flex-1" orientation="both">
			<Table className="border-separate border-spacing-0 table-fixed w-full">
				<CollectionTableHeader />
				<TableBody>
					{tracks.map((track, index) => (
						<TableRow
							key={track.id}
							className={cn(
								"group transition-colors duration-150",
								index % 2 === 0 && "bg-muted/20",
								"hover:bg-muted/40",
							)}
						>
							<TableCell className="relative py-0">
								{currentTrack?.id === track.id && isPlaying ? (
									<div className="mx-auto flex size-[0.65rem] items-end justify-center space-x-0.5">
										<div className="animate-now-playing-1 w-1 bg-primary"></div>
										<div className="animate-now-playing-2 w-1 bg-primary [animation-delay:0.2s]"></div>
										<div className="animate-now-playing-3 w-1 bg-primary [animation-delay:0.4s]"></div>
									</div>
								) : (
									<div className="mx-auto flex items-center justify-center size-6">
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
							</TableCell>
							<TableCell className="text-sm py-1 min-w-0 max-w-0">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 min-w-0 flex-1">
										{showCover && (
											<Cover
												size="sm"
												imageSrc={track.artwork}
												alt={track.title}
												className="flex-shrink-0"
											/>
										)}
										<p className="truncate min-w-0">{track.title}</p>
									</div>
									<LikeButton
										isLiked={false}
										onClick={() => {}}
										className="hidden group-hover:flex group-focus:flex flex-shrink-0"
									/>
								</div>
							</TableCell>
							<TableCell className="text-sm text-muted-foreground hidden md:table-cell">
								{track.artist}
							</TableCell>
							<TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
								{track.album}
							</TableCell>
							<TableCell className="text-sm text-muted-foreground hidden xl:table-cell">
								{track.type.charAt(0).toUpperCase() + track.type.slice(1)}
							</TableCell>
							<TableCell className="pr-1 py-1 text-right flex items-center justify-end gap-1">
								<p className="text-sm text-muted-foreground/70 tabular-nums">
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
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</ScrollArea>
	);
};

const CollectionTableHeader = () => {
	return (
		<TableHeader className="sticky top-0 z-10">
			<TableRow className="bg-background!">
				<TableHead className="w-11 text-muted-foreground/80 text-center">
					#
				</TableHead>
				<TableHead className="text-muted-foreground/80 w-1/2">Name</TableHead>
				<TableHead className="w-24 text-muted-foreground/80 hidden md:table-cell">
					Artist
				</TableHead>
				<TableHead className="w-36 text-muted-foreground/80 hidden lg:table-cell">
					Album
				</TableHead>
				<TableHead className="w-28 text-muted-foreground/80 hidden xl:table-cell">
					Type
				</TableHead>
				<TableHead className="w-20 text-right text-muted-foreground/80">
					Duration
				</TableHead>
			</TableRow>
		</TableHeader>
	);
};
