import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = Route.useRouteContext();

	return (
		<main className="flex flex-col gap-4 p-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Home</h1>
				<p className="text-muted-foreground text-sm">
					Connected: {user ? "Yes" : "No"}
				</p>
			</div>
		</main>
	);
}
