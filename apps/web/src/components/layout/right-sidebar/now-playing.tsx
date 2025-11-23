import { useAudioStore } from "@opium/audio";
import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import { useMemo } from "react";
import { MediaItem } from "@/components/media-item";

type NowPlayingViewProps = {
	openQueue: () => void;
};

export function NowPlayingView({ openQueue }: NowPlayingViewProps) {
	const currentTrack = useAudioStore((state) => state.currentTrack);
	const queue = useAudioStore((state) => state.queue);
	const currentQueueIndex = useAudioStore((state) => state.currentQueueIndex);
	const repeatMode = useAudioStore((state) => state.repeatMode);

	const reorderedQueue = useMemo(() => {
		const previousTracks = queue.slice(0, currentQueueIndex);
		const upcomingTracks = queue.slice(currentQueueIndex);

		if (repeatMode === "all") {
			return [...upcomingTracks, ...previousTracks];
		}

		return upcomingTracks;
	}, [queue, currentQueueIndex, repeatMode]);

	const nextTrack = reorderedQueue[1];

	return (
		<div className="flex w-full flex-1 gap-2 flex-col overflow-hidden">
			<div className="w-full flex justify-between items-center h-8 px-3">
				<span className="text-sm font-semibold text-foreground">
					Now Playing
				</span>
			</div>

			<div className="flex h-full w-full flex-1 flex-col overflow-hidden">
				<div className="flex h-full w-full flex-col overflow-y-auto gap-4">
					<Cover
						size="xl"
						variant="blur"
						imageSrc={currentTrack?.artwork}
						alt={currentTrack?.title}
						className="px-3"
					/>

					<div className="flex flex-1 flex-col gap-2 px-3">
						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-medium text-muted-foreground">
								Title
							</span>
							<span className="text-sm">{currentTrack?.title}</span>
						</div>

						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-medium text-muted-foreground">
								Artist
							</span>
							<span className="text-sm">{currentTrack?.artist}</span>
						</div>

						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-medium text-muted-foreground">
								Duration
							</span>
							<span className="text-sm">{`${Math.floor((currentTrack?.duration ?? 0) / 60)}:${((currentTrack?.duration ?? 0) % 60).toString().padStart(2, "0")}`}</span>
						</div>

						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-medium text-muted-foreground">
								Album
							</span>
							<span className="text-sm">{currentTrack?.album}</span>
						</div>

						{currentTrack?.type && (
							<div className="flex flex-col gap-0.5">
								<span className="text-xs font-medium text-muted-foreground">
									Type
								</span>
								<span className="text-sm">
									{currentTrack.type.charAt(0).toUpperCase() +
										currentTrack.type.slice(1).toLowerCase()}
								</span>
							</div>
						)}
					</div>
					{nextTrack && (
						<div className="flex flex-col gap-0">
							<div className="flex justify-between items-center px-3 ">
								<span className="text-xs font-medium text-muted-foreground">
									Next Song
								</span>
								<Button
									variant="link"
									size="xs"
									className="p-0"
									onClick={openQueue}
								>
									Open Queue
								</Button>
							</div>
							<div className="px-1">
								<MediaItem
									key={nextTrack.id}
									href={"/album/$id"}
									params={{ id: nextTrack.id.toString() }}
									description={nextTrack.artist}
									image={nextTrack.artwork}
									isExpanded={true}
									title={nextTrack.title}
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
