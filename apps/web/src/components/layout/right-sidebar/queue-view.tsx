import { Button } from "@opium/ui/components/button";
import { XIcon } from "lucide-react";
import { LibraryItem } from "../sidebar/sidebar-library";
import { usePlayerStore } from "@opium/player";

type QueueViewProps = {
	onClose: () => void;
};

export function QueueView({ onClose }: QueueViewProps) {
	const queue = usePlayerStore((state) => state.queue);

	return (
		<div className="flex w-full flex-1 gap-2 flex-col overflow-hidden">
			<div className="w-full flex justify-between items-center h-8 px-3">
				<span className="text-sm font-semibold text-foreground">Queue</span>
				<Button variant="ghost" size="icon-sm" onClick={onClose}>
					<XIcon />
				</Button>
			</div>

			<div className="flex size-full flex-1 flex-col overflow-y-auto px-1">
				{queue.map((track) => (
					<LibraryItem
						key={track.id}
						to={"/album/$id"}
						params={{ id: track.id }}
						description={track.artist}
						imageSrc={track.artwork}
						isSidebarOpen={true}
						title={track.title}
					/>
				))}
			</div>
		</div>
	);
}
