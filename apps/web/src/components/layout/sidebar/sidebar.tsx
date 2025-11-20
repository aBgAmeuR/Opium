import { cn } from "@opium/ui/lib/utils";
import { useRouterState } from "@tanstack/react-router";
import { SidebarHeader } from "./sidebar-header";
import { SidebarLibrary } from "./sidebar-library";
import { SidebarNavigation } from "./sidebar-navigation";
import { useSidebar } from "./sidebar-provider";
import { SidebarSearch } from "./sidebar-search";
import { SidebarUserMenu } from "./sidebar-user-menu";

type SidebarProps = {
	isAdmin: boolean;
};

export const Sidebar = ({ isAdmin }: SidebarProps) => {
	const { open } = useSidebar();
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
				<SidebarHeader />
				<SidebarSearch />
				<SidebarNavigation pathname={pathname} isAdmin={isAdmin} />
				<SidebarLibrary />
				<SidebarUserMenu />
			</div>
		</div>
	);
};
