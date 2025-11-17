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
import { cn } from "@opium/ui/lib/utils";
import { useState } from "react";

// Mock data
const mockSong = {
	id: "1",
	title:
		"4tspoon (feat. Yung Bans) fgze gggggggggg gezg gjuizehzeherio àzeig egjiogzeiogze àigzeug g zerio gje iej  fj fjazef j ezezjg jro jezopj eo",
	artist: "Playboi Carti",
	image:
		"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
	duration: 180,
};

const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
};

type RepeatMode = "off" | "all" | "one";

export function AudioPlayer({ onToggleQueue }: { onToggleQueue?: () => void }) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState<number>(45); // Mock current time in seconds
	const [volume, setVolume] = useState(70); // Volume percentage
	const [isMuted, setIsMuted] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [isShuffle, setIsShuffle] = useState(false);
	const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentTime(Number(e.target.value));
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = Number(e.target.value);
		setVolume(newVolume);
		setIsMuted(newVolume === 0);
	};

	const handleMute = () => {
		if (isMuted) {
			setIsMuted(false);
		} else {
			setIsMuted(true);
		}
	};

	const handleRepeat = () => {
		const modes: RepeatMode[] = ["off", "all", "one"];
		const currentIndex = modes.indexOf(repeatMode);
		const nextIndex = (currentIndex + 1) % modes.length;
		setRepeatMode(modes.at(nextIndex) ?? "off");
	};

	return (
		<div className="z-50 bg-sidebar w-full">
			{/* Player Controls */}
			<div className="flex w-full items-center gap-4 px-3 py-3">
				<div className="absolute left-0 right-0 top-0 w-full">
					<Slider
						className="[&_[data-slot=slider-track]]:before:rounded-none [&_[data-slot=slider-indicator]]:rounded-none [&_[data-slot=slider-indicator]]:![margin-inline-start:0] [&_[data-slot=slider-thumb]]:size-3"
						value={currentTime}
						onValueChange={(value) => setCurrentTime(value as number)}
						max={mockSong.duration}
						aria-label="Seek"
					/>
				</div>

				{/* Song Info */}
				<div className="flex min-w-0 flex-1 items-center gap-3">
					<Cover size="md" imageSrc={mockSong.image} alt={mockSong.title} />
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium text-foreground">
							{mockSong.title}
						</p>
						<p className="truncate text-xs text-muted-foreground">
							{mockSong.artist}
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

				{/* Main Controls */}
				<div className="flex flex-col items-center gap-1">
					{/* Control Buttons */}
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => setIsShuffle(!isShuffle)}
							className={cn(isShuffle && "text-primary")}
							aria-label="Toggle shuffle"
						>
							<ShuffleIcon />
						</Button>

						<Button variant="ghost" size="icon-sm" aria-label="Previous song">
							<PreviousIcon />
						</Button>

						<Button
							variant="default"
							size="icon-sm"
							onClick={handlePlayPause}
							aria-label={isPlaying ? "Pause" : "Play"}
						>
							{isPlaying ? <PauseIcon /> : <PlayIcon />}
						</Button>

						<Button variant="ghost" size="icon-sm" aria-label="Next song">
							<NextIcon />
						</Button>

						<Button
							variant="ghost"
							size="icon-sm"
							onClick={handleRepeat}
							className={cn(repeatMode !== "off" && "text-primary")}
							aria-label={`Repeat: ${repeatMode}`}
						>
							{repeatMode === "one" ? <RepeatIcon /> : <RepeatIcon />}
						</Button>
					</div>
				</div>

				{/* Volume and Queue Controls */}
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
							onClick={handleMute}
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
