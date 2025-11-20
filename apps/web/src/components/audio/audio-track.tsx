import { useAudioStore } from "@opium/audio";
import { Cover } from "@opium/ui/components/cover";
import { useState } from "react";
import { LikeButton } from "../like-button";

export const AudioTrack = () => {
	const currentTrack = useAudioStore((state) => state.currentTrack);
	const [isLiked, setIsLiked] = useState(false);

	return (
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
			<LikeButton isLiked={isLiked} onClick={() => setIsLiked(!isLiked)} />
		</div>
	);
};
