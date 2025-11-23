import { useAudioStore } from "@opium/audio";
import {
	NextIcon,
	PauseIcon,
	PlayIcon,
	PreviousIcon,
	RepeatIcon,
	RepeatOneIcon,
	ShuffleIcon,
} from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { Toggle } from "@opium/ui/components/toggle";

export const AudioControls = () => {
	return (
		<div className="flex items-center gap-1">
			<AudioQueueShuffle />
			<AudioSkipBack />
			<AudioPlay />
			<AudioSkipForward />
			<AudioQueueRepeatMode />
		</div>
	);
};

const AudioSkipBack = () => {
	const previous = useAudioStore((state) => state.previous);

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={previous}
			aria-label="Previous song"
		>
			<PreviousIcon />
		</Button>
	);
};

const AudioPlay = () => {
	const togglePlay = useAudioStore((state) => state.togglePlay);
	const isPlaying = useAudioStore((state) => state.isPlaying);

	return (
		<Button
			variant="default"
			size="icon-sm"
			onClick={togglePlay}
			aria-label="Play"
		>
			{isPlaying ? <PauseIcon /> : <PlayIcon />}
		</Button>
	);
};

const AudioSkipForward = () => {
	const next = useAudioStore((state) => state.next);

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={next}
			aria-label="Next song"
		>
			<NextIcon />
		</Button>
	);
};

const AudioQueueShuffle = () => {
	const shuffleEnabled = useAudioStore((state) => state.shuffleEnabled);
	const toggleShuffle = useAudioStore((state) => state.toggleShuffle);

	return (
		<Toggle
			aria-label="Toggle shuffle"
			size="sm"
			pressed={shuffleEnabled}
			onPressedChange={toggleShuffle}
		>
			<ShuffleIcon />
		</Toggle>
	);
};

const AudioQueueRepeatMode = () => {
	const repeatMode = useAudioStore((state) => state.repeatMode);
	const changeRepeatMode = useAudioStore((state) => state.changeRepeatMode);

	return (
		<Toggle
			aria-label="Toggle repeat"
			size="sm"
			pressed={repeatMode !== "all"}
			onPressedChange={changeRepeatMode}
		>
			{repeatMode === "one" ? <RepeatOneIcon /> : <RepeatIcon />}
		</Toggle>
	);
};
