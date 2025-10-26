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

type AlbumsTableProps = {
	albums: Awaited<ReturnType<typeof orpc.album.list.call>>;
	isLoading: boolean;
};

export const AlbumsTable = ({ albums, isLoading }: AlbumsTableProps) => {
	return (
		<Frame className="w-full">
			<FramePanel>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Cover</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Artist</TableHead>
							<TableHead>Total Songs</TableHead>
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
						) : albums.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="h-16 text-center">
									No albums found
								</TableCell>
							</TableRow>
						) : (
							albums.map((album) => (
								<TableRow key={album.id}>
									<TableCell className="font-medium">
										<Image
											src={album.cover}
											alt={album.name}
											width={32}
											height={32}
											className="rounded-md object-cover"
										/>
									</TableCell>
									<TableCell>{album.name}</TableCell>
									<TableCell>{album.artistName}</TableCell>
									<TableCell>{album.totalSongs}</TableCell>
									<TableCell>{album.createdAt.toLocaleDateString()}</TableCell>
									<TableCell>{album.updatedAt.toLocaleDateString()}</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={6}>Total Albums: {albums.length}</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</FramePanel>
		</Frame>
	);
};
