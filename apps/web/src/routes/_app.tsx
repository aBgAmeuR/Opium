import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AudioProvider } from "@/components/audio/provider";
import { RootLayout } from "@/components/layout/root";
import { getUserFn } from "@/functions/auth";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUserFn();
		return { user: session?.user, isAdmin: session?.user?.role === "admin" };
	},
});

function RouteComponent() {
	const { isAdmin } = Route.useRouteContext();

	return (
		<AudioProvider>
			<RootLayout isAdmin={isAdmin}>
				<Outlet />
			</RootLayout>
		</AudioProvider>
	);
}
