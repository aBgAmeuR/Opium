import { Button } from "@opium/ui/components/button";
import { XIcon } from "lucide-react";
import { LibraryItem } from "../sidebar/sidebar-library";

const mockQueue = [
	{
		id: 1,
		title: "Bristolyc - Break Remix",
		artist: "Break Remix",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
	},
	{
		id: 2,
		title: "Games",
		artist: "Mat Zo",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
	},
	{
		id: 3,
		title: "Parallels",
		artist: "Black Sun Empire",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
	},
	{
		id: 4,
		title: "Eli Eli - Maduk Remix",
		artist: "Maduk",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
	},
	{
		id: 5,
		title: "Police In Helicopter",
		artist: "Be...",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
	},
	{
		id: 6,
		title: "Murder Music",
		artist: "K...aka P...",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
	},
	{
		id: 7,
		title: "Fragments",
		artist: "Workforce",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
	},
	{
		id: 8,
		title: "Be True",
		artist: "Commodo",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
	},
	{
		id: 9,
		title: "Bricks Don't Roll",
		artist: "DJ Hazard",
		image:
			"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
	},
];

type QueueViewProps = {
	onClose: () => void;
};

export function QueueView({ onClose }: QueueViewProps) {
	return (
		<div className="flex w-full flex-1 gap-2 flex-col overflow-hidden">
			<div className="w-full flex justify-between items-center h-8 px-3">
				<span className="text-sm font-semibold text-foreground">Queue</span>
				<Button variant="ghost" size="icon-sm" onClick={onClose}>
					<XIcon />
				</Button>
			</div>

			<div className="flex size-full flex-1 flex-col overflow-y-auto px-1">
				{mockQueue.map((track) => (
					<LibraryItem
						key={track.id.toString()}
						to={"/album/$id"}
						params={{ id: track.id.toString() }}
						description={track.artist}
						imageSrc={track.image}
						isSidebarOpen={true}
						title={track.title}
					/>
				))}
			</div>
		</div>
	);
}
