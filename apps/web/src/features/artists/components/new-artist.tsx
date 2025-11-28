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
import { Spinner } from "@opium/ui/components/spinner";
import { PlusIcon } from "@opium/icons";
import React from "react";
import { orpc } from "@/utils/orpc";
import { useQueryClient } from "@tanstack/react-query";

export const NewArtist = () => {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const queryClient = useQueryClient();

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		setLoading(true);

		const { url: imageUrl } = await orpc.image.upload.call({
			file: formData.get("image") as File,
			prefix: "artists",
		});

		await orpc.artist.create.call({
			name: formData.get("name") as string,
			image: imageUrl,
		});

		setLoading(false);
		setDialogOpen(false);
		queryClient.invalidateQueries({ queryKey: orpc.artist.list.queryKey() });
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger render={<Button />}>
				<PlusIcon className="size-4" />
				New Artist
			</DialogTrigger>
			<DialogPopup className="sm:max-w-sm">
				<Form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle className="font-bold">New Artist</DialogTitle>
						<DialogDescription>
							Create a new artist with a name and image.
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
								Image <span className="text-destructive">*</span>
							</FieldLabel>
							<FieldControl
								type="file"
								name="image"
								required
								placeholder="Select image"
								disabled={loading}
							/>
							<FieldError>Image is required</FieldError>
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
