import {
	HeartAddIcon,
	HeartIcon,
	NextIcon,
	PauseIcon,
	PlayIcon,
	PreviousIcon,
	QueueIcon,
	RepeatIcon,
	ShuffleIcon,
	VolumeHighIcon,
	VolumeOffIcon,
} from "@opium/icons";
import { usePlayerStore } from "@opium/player";
import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import { Slider } from "@opium/ui/components/slider";
import { cn } from "@opium/ui/lib/utils";
import { useState } from "react";

export function AudioPlayer({ onToggleQueue }: { onToggleQueue?: () => void }) {
	const isPlaying = usePlayerStore((s) => s.isPlaying);
	const volume = usePlayerStore((s) => s.volume);
	const isMuted = usePlayerStore((s) => s.isMuted);
	const isShuffle = usePlayerStore((s) => s.isShuffle);
	const repeatMode = usePlayerStore((s) => s.repeatMode);
	const queue = usePlayerStore((s) => s.queue);
	const currentTrackIndex = usePlayerStore((s) => s.currentTrackIndex);
	const currentTime = usePlayerStore((s) => s.currentTime);
	const togglePlayPause = usePlayerStore((s) => s.togglePlayPause);
	const next = usePlayerStore((s) => s.next);
	const prev = usePlayerStore((s) => s.prev);
	const seek = usePlayerStore((s) => s.seek);
	const setVolume = usePlayerStore((s) => s.setVolume);
	const toggleMute = usePlayerStore((s) => s.toggleMute);
	const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
	const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);

	const [isLiked, setIsLiked] = useState(false);

	const currentTrack = queue[currentTrackIndex];

	if (!currentTrack) {
		return null;
	}

	return (
		<div className="z-50 bg-sidebar w-full">
			<div className="flex w-full items-center gap-4 px-3 py-3">
				<div className="absolute left-0 right-0 top-0 w-full">
					<Slider
						className="[&_[data-slot=slider-track]]:before:rounded-none [&_[data-slot=slider-indicator]]:rounded-none [&_[data-slot=slider-indicator]]:![margin-inline-start:0] [&_[data-slot=slider-thumb]]:size-3"
						value={currentTime}
						onValueChange={(value) => {
							// For instant feedback, we could update locally or just call seek
							// Calling seek will update seekTrigger -> Audio Logic -> Howler -> update currentTime in store
							seek(value as number);
						}}
						max={currentTrack.duration || 180}
						aria-label="Seek"
					/>
				</div>

				<div className="flex min-w-0 flex-1 items-center gap-3">
					<Cover
						size="md"
						imageSrc={currentTrack.artwork}
						alt={currentTrack.title}
					/>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium text-foreground">
							{currentTrack.title}
						</p>
						<p className="truncate text-xs text-muted-foreground">
							{currentTrack.artist}
						</p>
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={() => setIsLiked(!isLiked)}
						aria-label={isLiked ? "Unlike song" : "Like song"}
					>
						{isLiked ? (
							<HeartIcon className="size-4 text-red-500" />
						) : (
							<HeartAddIcon className="size-4" />
						)}
					</Button>
				</div>

				<div className="flex flex-col items-center gap-1">
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={toggleShuffle}
							className={cn(isShuffle && "text-primary")}
							aria-label="Toggle shuffle"
						>
							<ShuffleIcon />
						</Button>

						<Button
							variant="ghost"
							size="icon-sm"
							onClick={prev}
							aria-label="Previous song"
						>
							<PreviousIcon />
						</Button>

						<Button
							variant="default"
							size="icon-sm"
							onClick={togglePlayPause}
							aria-label={isPlaying ? "Pause" : "Play"}
						>
							{isPlaying ? <PauseIcon /> : <PlayIcon />}
						</Button>

						<Button
							variant="ghost"
							size="icon-sm"
							onClick={next}
							aria-label="Next song"
						>
							<NextIcon />
						</Button>

						<Button
							variant="ghost"
							size="icon-sm"
							onClick={toggleRepeat}
							className={cn(repeatMode !== "off" && "text-primary")}
							aria-label={`Repeat: ${repeatMode}`}
						>
							{repeatMode === "one" ? <RepeatIcon /> : <RepeatIcon />}
						</Button>
					</div>
				</div>

				<div className="flex min-w-0 flex-1 items-center justify-end">
					{onToggleQueue && (
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={onToggleQueue}
							aria-label="Toggle queue"
						>
							<QueueIcon />
						</Button>
					)}

					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={toggleMute}
							aria-label={isMuted ? "Unmute" : "Mute"}
						>
							{isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeHighIcon />}
						</Button>
						<Slider
							value={isMuted ? 0 : volume}
							onValueChange={(value) => setVolume(value as number)}
							max={100}
							min={0}
							className="w-24!"
							aria-label="Volume"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
