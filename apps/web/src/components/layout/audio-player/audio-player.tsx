import { useAudioStore } from "@opium/audio";
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
import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import { Slider } from "@opium/ui/components/slider";
import { Toggle } from "@opium/ui/components/toggle";
import { useState } from "react";

export function AudioPlayer({ onToggleQueue }: { onToggleQueue?: () => void }) {
	const isPlaying = useAudioStore((state) => state.isPlaying);
	const volume = useAudioStore((state) => state.volume);
	const isMuted = useAudioStore((state) => state.isMuted);
	const shuffleEnabled = useAudioStore((state) => state.shuffleEnabled);
	const repeatMode = useAudioStore((state) => state.repeatMode);
	const currentTime = useAudioStore((state) => state.currentTime);
	const seek = useAudioStore((state) => state.seek);
	const setVolume = useAudioStore((state) => state.setVolume);
	const toggleMute = useAudioStore((state) => state.toggleMute);
	const toggleShuffle = useAudioStore((state) => state.toggleShuffle);
	const previous = useAudioStore((state) => state.previous);
	const next = useAudioStore((state) => state.next);
	const changeRepeatMode = useAudioStore((state) => state.changeRepeatMode);
	const togglePlay = useAudioStore((state) => state.togglePlay);
	const currentTrack = useAudioStore((state) => state.currentTrack);

	const [isLiked, setIsLiked] = useState(false);

	return (
		<div className="z-50 bg-sidebar w-full">
			<div className="flex w-full items-center gap-4 px-3 py-3">
				<div className="absolute left-0 right-0 top-0 w-full">
					<Slider
						className="[&_[data-slot=slider-track]]:before:rounded-none [&_[data-slot=slider-indicator]]:rounded-none [&_[data-slot=slider-indicator]]:![margin-inline-start:0] [&_[data-slot=slider-thumb]]:size-3"
						value={currentTime}
						onValueChange={(value) => seek(value as number)}
						max={currentTrack?.duration || 0}
						aria-label="Seek"
					/>
				</div>

				<div className="flex min-w-0 flex-1 items-center gap-3">
					<Cover
						size="md"
						imageSrc={currentTrack?.artwork}
						alt={currentTrack?.title}
					/>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium text-foreground">
							{currentTrack?.title || "Unknown Title"}
						</p>
						<p className="truncate text-xs text-muted-foreground">
							{currentTrack?.artist || "Unknown Artist"}
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
						<Toggle
							aria-label="Toggle shuffle"
							size="sm"
							pressed={shuffleEnabled}
							onPressedChange={toggleShuffle}
						>
							<ShuffleIcon />
						</Toggle>

						<Button
							variant="ghost"
							size="icon-sm"
							onClick={previous}
							aria-label="Previous song"
						>
							<PreviousIcon />
						</Button>

						<Button
							variant="default"
							size="icon-sm"
							onClick={togglePlay}
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

						<Toggle
							aria-label="Toggle repeat"
							size="sm"
							pressed={repeatMode === "one"}
							onPressedChange={changeRepeatMode}
						>
							{repeatMode === "one" ? <RepeatIcon /> : <RepeatIcon />}
						</Toggle>
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
