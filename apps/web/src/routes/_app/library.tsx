import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUser } from "@/functions/auth";

export const Route = createFileRoute("/_app/library")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUser();
		if (!session) throw redirect({ to: "/login" });
		return { session };
	},
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	return (
		<main className="flex flex-col gap-4 p-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Library</h1>
				<p className="text-muted-foreground text-sm">
					Your library of tracks, playlists, and albums
				</p>
			</div>
		</main>
	);
}
