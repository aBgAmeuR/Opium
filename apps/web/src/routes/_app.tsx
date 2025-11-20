import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AudioProvider } from "@/components/audio/audio-provider";
import { RootLayout } from "@/components/layout/root";
import { SidebarProvider } from "@/components/layout/sidebar/sidebar-provider";
import { getUserFn } from "@/functions/auth";
import { getSidebarStateFn } from "@/functions/sidebar";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUserFn();
		const sidebarOpen = await getSidebarStateFn();
		return {
			user: session?.user,
			isAdmin: session?.user?.role === "admin",
			sidebarOpen,
		};
	},
});

function RouteComponent() {
	const { isAdmin, sidebarOpen } = Route.useRouteContext();

	return (
		<AudioProvider>
			<SidebarProvider defaultOpen={sidebarOpen}>
				<RootLayout isAdmin={isAdmin}>
					<Outlet />
				</RootLayout>
			</SidebarProvider>
		</AudioProvider>
	);
}
