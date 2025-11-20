import { QueueIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { AudioControls } from "./audio-controls";
import { AudioSeekBar } from "./audio-seek-bar";
import { AudioTrack } from "./audio-track";
import { AudioVolume } from "./audio-volume";

type AudioPlayerProps = {
	onToggleQueue?: () => void;
};

export const AudioPlayer = ({ onToggleQueue }: AudioPlayerProps) => {
	return (
		<div className="flex w-full items-center gap-4 px-3 py-3">
			<div className="absolute left-0 right-0 top-0 w-full">
				<AudioSeekBar />
			</div>

			<AudioTrack />

			<AudioControls />

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

				<AudioVolume />
			</div>
		</div>
	);
};
