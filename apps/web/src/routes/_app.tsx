import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RootLayout } from "@/components/layout/root";
import { isAdmin as isAdminFn } from "@/functions/auth";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
	beforeLoad: async () => {
		const isAdmin = await isAdminFn();
		return { isAdmin };
	},
});

function RouteComponent() {
	const { isAdmin } = Route.useRouteContext();

	return (
		<RootLayout isAdmin={isAdmin}>
			<Outlet />
		</RootLayout>
	);
}
