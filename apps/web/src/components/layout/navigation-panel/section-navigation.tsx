import { AdminIcon, ExploreIcon, HomeIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import {
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
} from "@opium/ui/components/tooltip";
import { cn } from "@opium/ui/lib/utils";
import { Link } from "@tanstack/react-router";
import { useNavigationPanel } from "./provider";

type NavigationPanelNavigationProps = {
	pathname: string;
	isAdmin: boolean;
};

const NavigationItem = ({
	icon: Icon,
	label,
	isPanelOpen,
	to,
	isActive,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	isPanelOpen: boolean;
	to: string;
	isActive: boolean;
}) => {
	const buttonContent = (
		<Button
			className={cn(
				isPanelOpen && "relative w-full justify-start",
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
			size={isPanelOpen ? "sm" : "icon-sm"}
			variant="ghost"
		>
			<Icon className={cn(isPanelOpen, "size-3.5")} />
			{isPanelOpen && (
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

	if (!isPanelOpen) {
		return (
			<Tooltip>
				<TooltipTrigger render={buttonContent} />
				<TooltipPopup side="right" sideOffset={4}>
					{label}
				</TooltipPopup>
			</Tooltip>
		);
	}

	return buttonContent;
};

export function NavigationPanelNavigation({
	pathname,
	isAdmin,
}: NavigationPanelNavigationProps) {
	const { open } = useNavigationPanel();

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
						isPanelOpen={open}
						label="Home"
						to="/dashboard"
						isActive={pathname === "/dashboard"}
					/>

					<NavigationItem
						icon={ExploreIcon}
						isPanelOpen={open}
						label="Explore"
						to="/explore"
						isActive={pathname === "/explore"}
					/>

					{isAdmin && (
						<NavigationItem
							icon={AdminIcon}
							isPanelOpen={open}
							label="Admin"
							to="/admin"
							isActive={pathname.startsWith("/admin")}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
