import { type Track, useAudioStore } from "@opium/audio";
import {
	HeartIcon,
	MoreIcon,
	PlayIcon,
	PlusIcon,
	QueueIcon,
	ShareIcon,
} from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuSub,
	MenuSubPopup,
	MenuSubTrigger,
	MenuTrigger,
} from "@opium/ui/components/menu";
import { useQuery } from "@tanstack/react-query";
import { Router } from "@tanstack/react-router";
import { useMemo } from "react";
import { Route } from "@/routes";
import { orpc } from "@/utils/orpc";

type CollectionTableMenuProps = {
	tracks: Track[];
	track: Track;
};

export const CollectionTableMenu = ({
	tracks,
	track,
}: CollectionTableMenuProps) => {
	const setQueueAndPlay = useAudioStore((state) => state.setQueueAndPlay);
	const addToQueue = useAudioStore((state) => state.addToQueue);

	const { data: library } = useQuery(orpc.library.getLibrary.queryOptions());
	const userLibrary = useMemo(
		() => library?.filter((item) => item.createdByUser),
		[library],
	);

	const handleSongPlay = async (track: Track) => {
		const trackIndex = tracks.findIndex((t) => t.id === track.id) ?? 0;
		await setQueueAndPlay(tracks, trackIndex);
	};

	return (
		<Menu>
			<MenuTrigger
				className="invisible group-hover:visible group-focus:visible"
				render={<Button variant="ghost" size="icon-sm" />}
			>
				<MoreIcon />
			</MenuTrigger>
			<MenuPopup align="start" sideOffset={4}>
				<MenuItem onClick={async () => await handleSongPlay(track)}>
					<PlayIcon />
					Play
				</MenuItem>
				<MenuSeparator />

				<MenuItem>
					<HeartIcon />
					Save in liked
				</MenuItem>

				<MenuSub orientation="horizontal">
					<MenuSubTrigger disabled={!userLibrary || userLibrary.length === 0}>
						<PlusIcon />
						Add to playlist
					</MenuSubTrigger>
					<MenuSubPopup>
						{userLibrary?.map((item) => (
							<MenuItem key={item.id}>{item.name}</MenuItem>
						))}
					</MenuSubPopup>
				</MenuSub>

				<MenuItem onClick={() => addToQueue(track, "last")}>
					<QueueIcon />
					Add to queue
				</MenuItem>

				<MenuSeparator />

				<MenuItem>
					<ShareIcon />
					Share
				</MenuItem>
			</MenuPopup>
		</Menu>
	);
};
