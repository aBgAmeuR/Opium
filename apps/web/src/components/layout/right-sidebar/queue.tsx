import { useAudioStore } from "@opium/audio";
import { CrossIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { useMemo } from "react";
import { MediaItem } from "@/components/media-item";

type QueueViewProps = {
	onClose: () => void;
};

export function QueueView({ onClose }: QueueViewProps) {
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

	return (
		<div className="flex w-full flex-1 gap-2 flex-col overflow-hidden">
			<div className="w-full flex justify-between items-center h-8 px-3">
				<span className="text-sm font-semibold text-foreground">Queue</span>
				<Button variant="ghost" size="icon-sm" onClick={onClose}>
					<CrossIcon />
				</Button>
			</div>

			<div className="flex size-full flex-1 flex-col overflow-y-auto px-1">
				{reorderedQueue.map((track) => (
					<MediaItem
						key={track.id}
						href={"/album/$id"}
						params={{ id: track.id }}
						description={track.artist}
						image={track.artwork}
						isExpanded={true}
						title={track.title}
					/>
				))}
			</div>
		</div>
	);
}
