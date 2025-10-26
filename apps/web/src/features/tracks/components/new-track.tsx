import { Button } from "@opium/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPopup,
	DialogTitle,
	DialogTrigger,
} from "@opium/ui/components/dialog";
import {
	Field,
	FieldControl,
	FieldError,
	FieldLabel,
} from "@opium/ui/components/field";
import { Form } from "@opium/ui/components/form";
import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from "@opium/ui/components/select";
import { Spinner } from "@opium/ui/components/spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import React from "react";
import { orpc } from "@/utils/orpc";

export const NewTrack = () => {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const queryClient = useQueryClient();

	const { data: artists } = useQuery(orpc.artist.list.queryOptions());
	const { data: albums } = useQuery(orpc.album.list.queryOptions());

	const getAudioLengthFromFile = (file: File): Promise<number> => {
		return new Promise<number>((resolve) => {
			const objectUrl = URL.createObjectURL(file);
			const audio = new Audio();
			audio.preload = "metadata";
			audio.src = objectUrl;
			audio.onloadedmetadata = () => {
				URL.revokeObjectURL(objectUrl);
				const durationSec = Number.isFinite(audio.duration)
					? Math.max(1, Math.round(audio.duration))
					: 0;
				resolve(durationSec);
			};
			audio.onerror = () => {
				URL.revokeObjectURL(objectUrl);
				resolve(0);
			};
		});
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		setLoading(true);

		const { url: fileUrl } = await orpc.image.upload.call({
			file: formData.get("audio") as File,
			prefix: "tracks",
		});

		const computedLength = await getAudioLengthFromFile(
			formData.get("audio") as File,
		);

		await orpc.song.create.call({
			title: formData.get("title") as string,
			artistId: Number(formData.get("artistId")),
			albumId: Number(formData.get("albumId")),
			type: formData.get("type") as
				| "official"
				| "remix"
				| "performance"
				| "remastered"
				| "AI"
				| "fan made"
				| "feature"
				| "leak",
			fileUrl,
			length: Math.max(1, Math.round(computedLength || 0)),
			featuredArtistIds: ((formData.get("featuredArtistIds") as string) || "")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean)
				.map((s) => Number(s)),
			producers: ((formData.get("producers") as string) || "")
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
		});

		setLoading(false);
		setDialogOpen(false);
		queryClient.invalidateQueries({ queryKey: orpc.song.list.queryKey() });
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger render={<Button />}>
				<PlusIcon className="size-4" />
				New Track
			</DialogTrigger>
			<DialogPopup className="sm:max-w-sm">
				<Form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle className="font-bold">New Track</DialogTitle>
						<DialogDescription>
							Create a new track
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<Field>
							<FieldLabel>
								Title <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldControl
								type="text"
								name="title"
								required
								placeholder="Enter title"
								disabled={loading}
							/>
							<FieldError>Title is required</FieldError>
						</Field>
						<Field>
							<FieldLabel>
								Artist <span className="text-destructive">*</span>
							</FieldLabel>
							<Select
								name="artistId"
								defaultValue={artists?.[0]?.id?.toString?.()}
								items={(artists ?? []).map((a) => ({
									label: a.name,
									value: a.id.toString(),
								}))}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectPopup>
									{(artists ?? []).map((a) => (
										<SelectItem key={a.id} value={a.id.toString()}>
											{a.name}
										</SelectItem>
									))}
								</SelectPopup>
							</Select>
							<FieldError>Artist is required</FieldError>
						</Field>
						<Field>
							<FieldLabel>
								Album <span className="text-destructive">*</span>
							</FieldLabel>
							<Select
								name="albumId"
								defaultValue={albums?.[0]?.id?.toString?.()}
								items={(albums ?? []).map((a) => ({
									label: a.name,
									value: a.id.toString(),
								}))}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectPopup>
									{(albums ?? []).map((a) => (
										<SelectItem key={a.id} value={a.id.toString()}>
											{a.name}
										</SelectItem>
									))}
								</SelectPopup>
							</Select>
							<FieldError>Album is required</FieldError>
						</Field>
						<Field>
							<FieldLabel>
								Type <span className="text-destructive">*</span>
							</FieldLabel>
							<Select
								name="type"
								defaultValue="official"
								items={[
									{ label: "Official", value: "official" },
									{ label: "Remix", value: "remix" },
									{ label: "Performance", value: "performance" },
									{ label: "Remastered", value: "remastered" },
									{ label: "AI", value: "AI" },
									{ label: "Fan made", value: "fan made" },
									{ label: "Feature", value: "feature" },
									{ label: "Leak", value: "leak" },
								]}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectPopup>
									<SelectItem value="official">Official</SelectItem>
									<SelectItem value="remix">Remix</SelectItem>
									<SelectItem value="performance">Performance</SelectItem>
									<SelectItem value="remastered">Remastered</SelectItem>
									<SelectItem value="AI">AI</SelectItem>
									<SelectItem value="fan made">Fan made</SelectItem>
									<SelectItem value="feature">Feature</SelectItem>
									<SelectItem value="leak">Leak</SelectItem>
								</SelectPopup>
							</Select>
							<FieldError>Type is required</FieldError>
						</Field>
						<Field>
							<FieldLabel>
								Audio file <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldControl
								type="file"
								name="audio"
								required
								accept="audio/*"
								disabled={loading}
							/>
							<FieldError>Audio is required</FieldError>
						</Field>

						<Field>
							<FieldLabel>Featured artist IDs (comma-separated)</FieldLabel>
							<FieldControl
								type="text"
								name="featuredArtistIds"
								placeholder="e.g. 12, 45"
								disabled={loading}
							/>
						</Field>
						<Field>
							<FieldLabel>Producers (comma-separated)</FieldLabel>
							<FieldControl
								type="text"
								name="producers"
								placeholder="Producer 1, Producer 2"
								disabled={loading}
							/>
						</Field>
					</div>
					<DialogFooter>
						<DialogClose render={<Button variant="ghost" />} disabled={loading}>
							Discard
						</DialogClose>
						<Button type="submit" disabled={loading}>
							{loading && <Spinner />}
							{loading ? "Creating..." : "Create"}
						</Button>
					</DialogFooter>
				</Form>
			</DialogPopup>
		</Dialog>
	);
};
