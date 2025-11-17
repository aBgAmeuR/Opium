import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import { Image } from "@unpic/react";
import { LibraryItem } from "../sidebar/sidebar-library";

const mockCurrentSong = {
	title: "4tspoon (feat. Yung Bans)",
	artist: "Playboi Carti",
	genre: "Hip-Hop",
	album: "Ca$h Carti",
	type: "Features",
	bpm: "-",
	key: "-",
	albumArtUrl:
		"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
};

const nextSongs = {
	id: 1,
	title: "Games",
	artist: "Mat Zo",
	image:
		"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
} as const;

type NowPlayingViewProps = {
	openQueue: () => void;
};

export function NowPlayingView({ openQueue }: NowPlayingViewProps) {
	return (
		<div className="flex w-full flex-1 gap-2 flex-col overflow-hidden">
			<div className="w-full flex justify-between items-center h-8 px-3">
				<span className="text-sm font-semibold text-foreground">
					Now Playing
				</span>
			</div>

			<div className="flex h-full w-full flex-1 flex-col overflow-hidden">
				<div className="flex h-full w-full flex-col overflow-y-auto gap-4">
					<Cover
						size="xl"
						variant="blur"
						imageSrc={mockCurrentSong.albumArtUrl}
						alt={mockCurrentSong.album}
						className="px-3"
					/>

					<div className="flex flex-1 flex-col gap-2 px-3">
						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-medium text-muted-foreground">
								Title
							</span>
							<span className="text-sm">{mockCurrentSong.title}</span>
						</div>

						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-medium text-muted-foreground">
								Artist
							</span>
							<span className="text-sm">{mockCurrentSong.artist}</span>
						</div>

						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-medium text-muted-foreground">
								Genre
							</span>
							<span className="text-sm">{mockCurrentSong.genre}</span>
						</div>

						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-medium text-muted-foreground">
								Album
							</span>
							<span className="text-sm">{mockCurrentSong.album}</span>
						</div>

						<div className="flex flex-col gap-0.5">
							<span className="text-xs font-medium text-muted-foreground">
								Type
							</span>
							<span className="text-sm">{mockCurrentSong.type}</span>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex flex-col gap-0.5">
								<span className="text-xs font-medium text-muted-foreground">
									BPM
								</span>
								<span className="text-sm">{mockCurrentSong.bpm}</span>
							</div>

							<div className="flex flex-col gap-0.5">
								<span className="text-xs font-medium text-muted-foreground">
									Key
								</span>
								<span className="text-sm">{mockCurrentSong.key}</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-0">
						<div className="flex justify-between items-center px-3 ">
							<span className="text-xs font-medium text-muted-foreground">
								Next Song
							</span>
							<Button
								variant="link"
								size="xs"
								className="p-0"
								onClick={openQueue}
							>
								Open Queue
							</Button>
						</div>
						<div className="px-1">
							<LibraryItem
								key={nextSongs.id.toString()}
								to={"/album/$id"}
								params={{ id: nextSongs.id.toString() }}
								description={nextSongs.artist}
								imageSrc={nextSongs.image}
								isSidebarOpen={true}
								title={nextSongs.title}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
