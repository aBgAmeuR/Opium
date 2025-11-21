import { Button } from "@opium/ui/components/button";
import { cn } from "@opium/ui/lib/utils";
import { HeartAddIcon, HeartIcon, PlayIcon } from "@opium/icons";
import { ReactNode } from "react";

export interface Track {
	id: string | number;
	title: string;
	artistName: string;
	albumName?: string;
	length: number;
	type: string;
	fileUrl: string;
	// properties needed for queue
	artistId?: number;
	albumId?: number;
	cover?: string;
}

interface TrackTableProps {
	tracks: Track[];
	currentTrackId?: string | number | null;
	isPlaying?: boolean;
	likedTrackIds: Set<string | number>;
	onPlay: (track: Track) => void;
	onLike: (trackId: string | number) => void;
	isLoading?: boolean;
	showAlbumColumn?: boolean;
}

export function TrackTable({
	tracks,
	currentTrackId,
	likedTrackIds,
	onPlay,
	onLike,
	isLoading,
	showAlbumColumn = true,
}: TrackTableProps) {
	if (isLoading) {
		return (
			<div className="text-sm text-muted-foreground">Loading songs...</div>
		);
	}

	if (!tracks || tracks.length === 0) {
		return (
			<div className="text-sm text-muted-foreground">
				No songs in this collection
			</div>
		);
	}

	return (
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
						{showAlbumColumn && (
							<th className="px-4 py-2 text-left text-xs font-normal text-muted-foreground/60">
								Release
							</th>
						)}
						<th className="px-4 py-2 text-left text-xs font-normal text-muted-foreground/60">
							Type
						</th>
						<th className="w-20 px-4 py-2 text-right text-xs font-normal text-muted-foreground/60">
							Duration
						</th>
					</tr>
				</thead>
				<tbody>
					{tracks.map((track, index) => {
						const minutes = Math.floor(track.length / 60);
						const seconds = track.length % 60;
						const formattedLength = `${minutes}:${seconds.toString().padStart(2, "0")}`;
						const isEven = index % 2 === 0;
						const isCurrentTrack = currentTrackId === track.id;

						return (
							<tr
								key={track.id}
								className={cn(
									"group transition-colors duration-150",
									isEven && "bg-muted/20",
									"hover:bg-muted/40",
								)}
							>
								<td className="relative pl-0 pr-2">
									{isCurrentTrack ? (
										<div className="mx-auto flex size-[0.65rem] items-end justify-center space-x-0.5">
											<div className="animate-now-playing-1 w-1 bg-primary"></div>
											<div className="animate-now-playing-2 w-1 bg-primary [animation-delay:0.2s]"></div>
											<div className="animate-now-playing-3 w-1 bg-primary [animation-delay:0.4s]"></div>
										</div>
									) : (
										<div className="flex items-center justify-center size-7">
											<span className="flex group-hover:hidden group-focus:hidden text-sm text-muted-foreground/70">
												{String(index + 1).padStart(2, "0")}
											</span>
											<Button
												variant="link"
												size="icon"
												className="hidden group-hover:flex group-focus:flex"
												onClick={() => onPlay(track)}
												aria-label={`Play ${track.title}`}
											>
												<PlayIcon />
											</Button>
										</div>
									)}
								</td>
								<td className="pl-4 py-1.5">
									<div className="flex items-center justify-between gap-3">
										<p className="text-sm text-foreground group-hover:text-foreground transition-colors">
											{track.title}
										</p>
										<Button
											variant="ghost"
											size="icon-sm"
											className={cn(
												"h-6 w-6 transition-opacity",
												likedTrackIds.has(track.id)
													? "opacity-100"
													: "opacity-0 group-hover:opacity-100",
											)}
											onClick={() => onLike(track.id)}
											aria-label={
												likedTrackIds.has(track.id)
													? `Unlike ${track.title}`
													: `Like ${track.title}`
											}
										>
											{likedTrackIds.has(track.id) ? (
												<HeartIcon className="size-4 text-red-500" />
											) : (
												<HeartAddIcon className="size-4" />
											)}
										</Button>
									</div>
								</td>
								<td className="px-4 py-1.5">
									<p className="text-sm text-muted-foreground/80">
										{track.artistName}
									</p>
								</td>
								{showAlbumColumn && (
									<td className="px-4 py-1.5">
										<p className="text-sm text-muted-foreground/80">
											{track.albumName}
										</p>
									</td>
								)}
								<td className="px-4 py-1.5">
									<p className="text-sm text-muted-foreground/80">
										{track.type ? track.type.charAt(0).toUpperCase() + track.type.slice(1) : 'Song'}
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
	);
}

