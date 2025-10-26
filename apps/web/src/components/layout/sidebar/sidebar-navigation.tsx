import { ExploreIcon, HomeIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import {
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
} from "@opium/ui/components/tooltip";
import { cn } from "@opium/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { UsersIcon } from "lucide-react";

type SidebarNavigationProps = {
	isSidebarOpen: boolean;
	pathname: string;
	isAdmin: boolean;
};

const NavigationItem = ({
	icon: Icon,
	label,
	isSidebarOpen,
	to,
	isActive,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	isSidebarOpen: boolean;
	to: string;
	isActive: boolean;
}) => {
	const buttonContent = (
		<Button
			className={cn(
				isSidebarOpen && "relative w-full justify-start",
				"group items-center px-2 text-muted-foreground",
			)}
			render={
				<Link
					to={to}
					activeProps={{
						className: "bg-primary text-primary-foreground hover:bg-primary/95",
					}}
				/>
			}
			size={isSidebarOpen ? "sm" : "icon-sm"}
			variant="ghost"
		>
			<Icon className={cn(isSidebarOpen, "size-3.5")} />
			{isSidebarOpen && (
				<p
					className={cn(
						"line-clamp-1 text-xs",
						!isActive && "group-hover:text-foreground",
					)}
				>
					{label}
				</p>
			)}
		</Button>
	);

	if (!isSidebarOpen) {
		return (
			<Tooltip delay={10}>
				<TooltipTrigger render={buttonContent} />
				<TooltipPopup side="right" sideOffset={4}>
					{label}
				</TooltipPopup>
			</Tooltip>
		);
	}

	return buttonContent;
};

export function SidebarNavigation({
	isSidebarOpen,
	pathname,
	isAdmin,
}: SidebarNavigationProps) {
	return (
		<div
			className={cn(
				"mt-2 flex w-full flex-col gap-2 border-hard border-t border-dashed px-3 py-2",
			)}
		>
			<div className="flex w-full flex-col items-start gap-0.5">
				<div className="flex w-full flex-col gap-0.5 border-border/50">
					<NavigationItem
						icon={HomeIcon}
						isSidebarOpen={isSidebarOpen}
						label="Home"
						to="/dashboard"
						isActive={pathname === "/dashboard"}
					/>

					<NavigationItem
						icon={ExploreIcon}
						isSidebarOpen={isSidebarOpen}
						label="Explore"
						to="/explore"
						isActive={pathname === "/explore"}
					/>

					{isAdmin && (
						<NavigationItem
							icon={UsersIcon}
							isSidebarOpen={isSidebarOpen}
							label="Manage Artists"
							to="/admin/artists"
							isActive={pathname === "/admin/artists"}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
