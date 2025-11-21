import { buttonVariants } from "@opium/ui/components/button";
import { cn } from "@opium/ui/lib/utils";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { MusicIcon, Pencil } from "lucide-react";
import { useState } from "react";
import { CollectionHeader } from "@/components/collection/collection-header";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/playlist/$id")({
	component: PlaylistComponent,
});

function PlaylistComponent() {
	const { user } = Route.useRouteContext();
	const { id } = Route.useParams();

	const { data: playlist } = useSuspenseQuery(
		orpc.playlist.getById.queryOptions({
			input: { id: Number(id) },
		}),
	);

	const queryClient = useQueryClient();
	const isOwner = user?.id === playlist.userId;

	const [isEditing, setIsEditing] = useState(false);
	const [editName, setEditName] = useState(playlist.name);
	const [editVisibility, setEditVisibility] = useState(playlist.visibility);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const updatePlaylistMutation = useMutation(
		orpc.playlist.update.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.playlist.getById.queryKey({
						input: { id: playlist.id },
					}),
				});
				queryClient.invalidateQueries({
					queryKey: orpc.playlist.getOwnPlaylists.queryKey(),
				});
				setIsEditing(false);
				setImageFile(null);
				setImagePreview(null);
			},
		}),
	);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleSave = async () => {
		let imageUrl = playlist.image;

		if (imageFile) {
			const { url } = await orpc.image.upload.call({
				file: imageFile,
				prefix: "playlists",
			});
			imageUrl = url;
		}

		updatePlaylistMutation.mutate({
			id: playlist.id,
			name: editName,
			visibility: editVisibility,
			image: imageUrl ?? null,
		});
	};

	const image = (
		<div className="relative size-48 flex-shrink-0 group">
			{playlist.image ? (
				<Image
					src={playlist.image}
					alt={playlist.name}
					className="size-48 object-cover rounded-[4px]"
					width={192}
					height={192}
				/>
			) : (
				<div className="flex size-48 items-center justify-center rounded-[4px] bg-muted text-muted-foreground">
					<MusicIcon className="size-8" />
				</div>
			)}
			{isOwner && (
				<div className="absolute right-1 bottom-1 items-center justify-center hidden group-hover:flex">
					<label
						className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
					>
						<input
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleImageChange}
						/>
						<Pencil className="size-4" />
					</label>
				</div>
			)}
		</div>
	);

	const metadata = (
		<>
			<span>
				{playlist.totalSongs ?? 0} song
				{(playlist.totalSongs ?? 0) !== 1 ? "s" : ""}
			</span>
			<span>•</span>
			<span>{playlist.createdAt.toLocaleDateString()}</span>
		</>
	);

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			<CollectionHeader
				image={image}
				title={playlist.name}
				subtitle={`${playlist.visibility} Playlist`}
				metadata={metadata}
			/>
		</div>
	);
}
