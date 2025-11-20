import { useAudioStore } from "@opium/audio";
import { VolumeHighIcon, VolumeOffIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { Slider } from "@opium/ui/components/slider";

export const AudioVolume = () => {
	const isMuted = useAudioStore((state) => state.isMuted);
	const toggleMute = useAudioStore((state) => state.toggleMute);
	const volume = useAudioStore((state) => state.volume);
	const setVolume = useAudioStore((state) => state.setVolume);

	return (
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
				value={isMuted ? 0 : volume * 100}
				onValueChange={(value) => setVolume((value as number) / 100)}
				max={100}
				min={0}
				className="w-24!"
				aria-label="Volume"
			/>
		</div>
	);
};
