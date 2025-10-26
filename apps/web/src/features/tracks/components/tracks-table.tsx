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

type TracksTableProps = {
	tracks: Awaited<ReturnType<typeof orpc.song.list.call>>;
	isLoading: boolean;
};

export const TracksTable = ({ tracks, isLoading }: TracksTableProps) => {
	return (
		<Frame className="w-full">
			<FramePanel>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Cover</TableHead>
							<TableHead>Title</TableHead>
							<TableHead>Artist</TableHead>
							<TableHead>Album</TableHead>
							<TableHead>Type</TableHead>
							<TableHead>Length (s)</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>Updated At</TableHead>
							<TableHead>Audio</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={8} className="h-16">
									<div className="flex items-center justify-center h-full">
										<Spinner className="size-4" />
									</div>
								</TableCell>
							</TableRow>
						) : tracks.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="h-16 text-center">
									No tracks found
								</TableCell>
							</TableRow>
						) : (
							tracks.map((track) => (
								<TableRow key={track.id}>
									<TableCell className="font-medium">
										<Image
											src={track.albumCover}
											alt={track.albumName}
											width={32}
											height={32}
											className="rounded-md object-cover"
										/>
									</TableCell>
									<TableCell>{track.title}</TableCell>
									<TableCell>{track.artistName}</TableCell>
									<TableCell>{track.albumName}</TableCell>
									<TableCell>{track.type}</TableCell>
									<TableCell>{track.length}</TableCell>
									<TableCell>{track.createdAt.toLocaleDateString()}</TableCell>
									<TableCell>{track.updatedAt.toLocaleDateString()}</TableCell>
									<TableCell>
										<audio controls>
											<track kind="captions" src={track.fileUrl} />
										</audio>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={8}>Total Tracks: {tracks.length}</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</FramePanel>
		</Frame>
	);
};
