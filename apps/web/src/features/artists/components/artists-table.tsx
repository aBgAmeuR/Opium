import { Frame, FramePanel } from "@opium/ui/components/frame";
import { Spinner } from "@opium/ui/components/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@opium/ui/components/table";
import { Image } from "@unpic/react";
import type { orpc } from "@/utils/orpc";

type ArtistsTableProps = {
	artists: Awaited<ReturnType<typeof orpc.artist.list.call>>;
	isLoading: boolean;
};

export const ArtistsTable = ({ artists, isLoading }: ArtistsTableProps) => {
	return (
		<Frame className="w-full">
			<FramePanel>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Image</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Total Songs</TableHead>
							<TableHead>Total Albums</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>Updated At</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={6} className="h-16">
									<div className="flex items-center justify-center h-full">
										<Spinner className="size-4" />
									</div>
								</TableCell>
							</TableRow>
						) : artists.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="h-16 text-center">
									No artists found
								</TableCell>
							</TableRow>
						) : (
							artists.map((artist) => (
								<TableRow key={artist.id}>
									<TableCell className="font-medium">
										<Image
											src={artist.image}
											alt={artist.name}
											width={32}
											height={32}
											className="rounded-md object-cover"
										/>
									</TableCell>
									<TableCell>{artist.name}</TableCell>
									<TableCell>{artist.totalSongs}</TableCell>
									<TableCell>{artist.totalAlbums}</TableCell>
									<TableCell>{artist.createdAt.toLocaleDateString()}</TableCell>
									<TableCell>{artist.updatedAt.toLocaleDateString()}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={6}>Total Artists: {artists.length}</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</FramePanel>
		</Frame>
	);
};
