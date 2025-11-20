import { useAudioStore } from "@opium/audio";
import { Slider } from "@opium/ui/components/slider";

export const AudioSeekBar = () => {
	const currentTime = useAudioStore((state) => state.currentTime);
	const seek = useAudioStore((state) => state.seek);
	const currentTrack = useAudioStore((state) => state.currentTrack);

	return (
		<Slider
			className="[&_[data-slot=slider-track]]:before:rounded-none [&_[data-slot=slider-indicator]]:rounded-none [&_[data-slot=slider-indicator]]:![margin-inline-start:0] [&_[data-slot=slider-thumb]]:size-3"
			value={currentTime}
			onValueChange={(value) => seek(value as number)}
			max={currentTrack?.duration || 0}
			aria-label="Seek"
		/>
	);
};
