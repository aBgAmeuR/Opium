import type { Track } from "@opium/audio";
import { ShuffleIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Collection,
	CollectionHero,
	CollectionHeroImage,
	CollectionHeroInfo,
	CollectionNav,
} from "@/components/collection";
import { CollectionTable } from "@/components/collection/collection-table";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/album/$id")({
	component: AlbumComponent,
});

function AlbumComponent() {
	const { id } = Route.useParams();

	const { data: album } = useSuspenseQuery(
		orpc.album.getById.queryOptions({
			input: { id: Number(id) },
		}),
	);

	const { data: songs, isLoading: isLoadingSongs } = useQuery(
		orpc.album.getSongs.queryOptions({
			input: { id: Number(id) },
		}),
	);

	const tracks: Track[] =
		songs?.map((s) => ({
			id: s.id,
			title: s.title,
			artist: s.artistName,
			artwork: album.cover,
			url: s.fileUrl,
			album: album.name,
			albumId: album.id,
			artistId: album.artistId,
			type: s.type,
			duration: s.length,
		})) ?? [];

	return (
		<Collection>
			<CollectionNav
				breadcrumbs={[
					{ icon: "album", label: "Albums", href: "/" },
					{ label: album.name },
				]}
			>
				<Button variant="secondary" size="sm">
					Play All
				</Button>
				<Button variant="ghost" size="icon-sm">
					<ShuffleIcon />
				</Button>
				{/* <LikeButton isLiked={isLiked} onClick={handleLike} /> */}
			</CollectionNav>

			<CollectionHero>
				<CollectionHeroImage imageSrc={album.cover} imageAlt={album.name} />
				<CollectionHeroInfo title={album.name} subtitle="Album">
					<Button
						variant="link"
						size="sm"
						className="p-0 text-foreground"
						render={
							<Link
								to="/album/$id"
								params={{ id: album.artistId.toString() }}
							/>
						}
					>
						{album.artistName}
					</Button>
					<span>•</span>
					<span>
						{album.totalSongs ?? 0} song
						{(album.totalSongs ?? 0) !== 1 ? "s" : ""}
					</span>
				</CollectionHeroInfo>
			</CollectionHero>

			<CollectionTable tracks={tracks} isLoading={isLoadingSongs} />
		</Collection>
	);
}
