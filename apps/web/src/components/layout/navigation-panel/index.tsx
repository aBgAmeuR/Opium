import { cn } from "@opium/ui/lib/utils";
import { useRouterState } from "@tanstack/react-router";
import { useNavigationPanel } from "./provider";
import { NavigationPanelHeader } from "./section-header";
import { NavigationPanelLibrary } from "./section-library";
import { NavigationPanelNavigation } from "./section-navigation";
import { NavigationPanelSearch } from "./section-search";
import { NavigationPanelUserMenu } from "./section-user-menu";

export { NavigationPanelProvider, useNavigationPanel } from "./provider";
export { NavigationPanelHeader } from "./section-header";
export { NavigationPanelLibrary } from "./section-library";
export { NavigationPanelNavigation } from "./section-navigation";
export { NavigationPanelSearch } from "./section-search";
export { NavigationPanelUserMenu } from "./section-user-menu";

type NavigationPanelProps = {
	isAdmin: boolean;
};

export const NavigationPanel = ({ isAdmin }: NavigationPanelProps) => {
	const { open } = useNavigationPanel();
	const { location } = useRouterState();
	const pathname = location.pathname.replace(/\/$/, "");

	return (
		<div
			className={cn(
				"relative top-0 bottom-0 left-0 z-50 flex h-dvh shrink-0 flex-col py-2 transition-all duration-200",
				open ? "top-0 h-full w-[200px]" : "top-0 h-full w-[50px]",
			)}
		>
			<div className="flex w-full flex-1 flex-col items-start overflow-hidden">
				<NavigationPanelHeader />
				<NavigationPanelSearch />
				<NavigationPanelNavigation pathname={pathname} isAdmin={isAdmin} />
				<NavigationPanelLibrary />
				<NavigationPanelUserMenu />
			</div>
		</div>
	);
};
