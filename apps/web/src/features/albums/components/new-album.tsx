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
import { PlusIcon } from "@opium/icons";
import React from "react";
import { orpc } from "@/utils/orpc";

export const NewAlbum = () => {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const { data: artists } = useQuery(orpc.artist.list.queryOptions());
	const queryClient = useQueryClient();

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		setLoading(true);

		const { url: coverUrl } = await orpc.image.upload.call({
			file: formData.get("cover") as File,
			prefix: "albums",
		});

		await orpc.album.create.call({
			name: formData.get("name") as string,
			artistId: Number(formData.get("artistId")),
			cover: coverUrl,
		});

		setLoading(false);
		setDialogOpen(false);
		queryClient.invalidateQueries({ queryKey: orpc.album.list.queryKey() });
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger render={<Button />}>
				<PlusIcon className="size-4" />
				New Album
			</DialogTrigger>
			<DialogPopup className="sm:max-w-sm">
				<Form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle className="font-bold">New Album</DialogTitle>
						<DialogDescription>
							Create a new album with a name, cover and artist.
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-4">
						<Field>
							<FieldLabel>
								Name <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldControl
								type="text"
								name="name"
								required
								placeholder="Enter name"
								disabled={loading}
							/>
							<FieldError>Name is required</FieldError>
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
								Cover <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldControl
								type="file"
								name="cover"
								required
								placeholder="Select cover image"
								disabled={loading}
							/>
							<FieldError>Cover is required</FieldError>
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
