import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { NewTrack } from "@/features/tracks/components/new-track";
import { TracksTable } from "@/features/tracks/components/tracks-table";
import { isAdmin as isAdminFn } from "@/functions/auth";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_app/admin/tracks")({
	component: RouteComponent,
	beforeLoad: async () => {
		const isAdmin = await isAdminFn();
		if (!isAdmin) {
			throw redirect({ to: "/dashboard" });
		}
	},
});

function RouteComponent() {
	const { data: tracks, isLoading } = useQuery(orpc.song.list.queryOptions());

	return (
		<main className="flex flex-col gap-4 p-6">
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-2xl tracking-tight">Manage Tracks</h1>
				<NewTrack />
			</div>
			<TracksTable tracks={tracks ?? []} isLoading={isLoading} />
		</main>
	);
}
