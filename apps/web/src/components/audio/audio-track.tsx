import { useAudioStore } from "@opium/audio";
import { Cover } from "@opium/ui/components/cover";
import { useState } from "react";
import {
	type ContentType,
	ContentTypeBadge,
} from "../catalog/content-type-badge";
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
				<div className="flex items-center gap-1">
					{currentTrack && (
						<ContentTypeBadge type={currentTrack.type as ContentType} />
					)}
					<p className="truncate text-xs text-muted-foreground">
						{currentTrack?.artist || "Unknown Artist"}
					</p>
				</div>
			</div>
			<LikeButton isLiked={isLiked} onClick={() => setIsLiked(!isLiked)} />
		</div>
	);
};
