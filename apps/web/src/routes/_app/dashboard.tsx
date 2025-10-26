import { Input } from "@opium/ui/components/input";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getUser } from "@/functions/auth";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUser();
		return { session };
	},
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	const { mutate: uploadImage } = useMutation(
		orpc.image.upload.mutationOptions({
			onSuccess: (data) => {
				console.log(data);
			},
		}),
	);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			uploadImage({
				file,
				prefix: "images",
			});
		}
	};
	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {session?.user.name}</p>
			<Input type="file" aria-label="File" onChange={handleFileChange} />
		</div>
	);
}
