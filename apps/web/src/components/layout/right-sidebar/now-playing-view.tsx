import { useAudioStore } from "@opium/audio";
import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import { LibraryItem } from "../sidebar/sidebar-library";

type NowPlayingViewProps = {
	openQueue: () => void;
};

export function NowPlayingView({ openQueue }: NowPlayingViewProps) {
	const currentTrack = useAudioStore((state) => state.currentTrack);
	const nextTrack = useAudioStore(
		(state) => state.queue[state.currentQueueIndex + 1],
	);

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
							<span className="text-sm">{currentTrack?.duration ?? 0}s</span>
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
								<LibraryItem
									key={nextTrack.id}
									to={"/album/$id"}
									params={{ id: nextTrack.id.toString() }}
									description={nextTrack.artist}
									imageSrc={nextTrack.artwork}
									isSidebarOpen={true}
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
