import { createFileRoute } from "@tanstack/react-router";
import { getUser } from "@/functions/auth";

export const Route = createFileRoute("/_app/dashboard")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUser();
		return { session };
	},
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	return (
		<main className="flex flex-col gap-4 p-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Home</h1>
				<p className="text-muted-foreground text-sm">
					Connected: {session?.user ? "Yes" : "No"}
				</p>
			</div>
		</main>
	);
}
