import { useAudioStore } from "@opium/audio";
import { ShuffleIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Collection,
	CollectionHero,
	CollectionHeroImage,
	CollectionHeroInfo,
	CollectionNav,
	CollectionTable,
} from "@/components/collection";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/playlist/liked")({
	component: PlaylistComponent,
});

function PlaylistComponent() {
	const setQueueAndPlay = useAudioStore((state) => state.setQueueAndPlay);

	const { data: tracks } = useSuspenseQuery(
		orpc.playlist.getLikedTracks.queryOptions(),
	);

	const handlePlayAll = async () => {
		await setQueueAndPlay(tracks, 0);
	};

	const handlePlayAllShuffle = async () => {
		const shuffledTracks = [...tracks].sort(() => Math.random() - 0.5);
		await setQueueAndPlay(shuffledTracks, 0);
	};

	return (
		<Collection>
			<CollectionNav
				breadcrumbs={[
					{ icon: "playlist", label: "Playlists", href: "/" },
					{ label: "Liked Tracks" },
				]}
			>
				<Button variant="secondary" size="sm" onClick={handlePlayAll}>
					Play All
				</Button>
				<Button variant="ghost" size="icon-sm" onClick={handlePlayAllShuffle}>
					<ShuffleIcon />
				</Button>
			</CollectionNav>

			<CollectionHero>
				<CollectionHeroImage
					src="https://cdn.opium.antoinejosset.fr/opium/playlists/liked_playlist.webp"
					alt="Liked Tracks"
				/>
				<CollectionHeroInfo title="Liked Tracks" subtitle="Private Playlist">
					<span>
						{tracks.length} song
						{tracks.length !== 1 ? "s" : ""}
					</span>
				</CollectionHeroInfo>
			</CollectionHero>

			<CollectionTable tracks={tracks} showCover />
		</Collection>
	);
}
