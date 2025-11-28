import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AudioProvider } from "@/components/audio/audio-provider";
import { InfoPanelProvider } from "@/components/layout/info-panel";
import { NavigationPanelProvider } from "@/components/layout/navigation-panel";
import { RootLayout } from "@/components/layout/root";
import { getUserFn } from "@/functions/auth";
import { getNavigationPanelStateFn } from "@/functions/navigation-panel";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
	beforeLoad: async () => {
		const session = await getUserFn();
		const navigationPanelOpen = await getNavigationPanelStateFn();
		return {
			user: session?.user,
			isAdmin: session?.user?.role === "admin",
			navigationPanelOpen,
		};
	},
});

function RouteComponent() {
	const { isAdmin, navigationPanelOpen } = Route.useRouteContext();

	return (
		<AudioProvider>
			<NavigationPanelProvider defaultOpen={navigationPanelOpen}>
				<InfoPanelProvider>
					<RootLayout isAdmin={isAdmin}>
						<Outlet />
					</RootLayout>
				</InfoPanelProvider>
			</NavigationPanelProvider>
		</AudioProvider>
	);
}
