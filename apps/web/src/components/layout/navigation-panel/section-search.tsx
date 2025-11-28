import { SearchIcon } from "@opium/icons";
import { Button } from "@opium/ui/components/button";
import { cn } from "@opium/ui/lib/utils";
import { useNavigationPanel } from "./provider";

const CommandMenuKbd = ({
	className,
	...props
}: React.ComponentProps<"kbd">) => (
	<kbd
		className={cn(
			"pointer-events-none flex h-5 select-none items-center justify-center gap-1 rounded border bg-background px-1 font-medium font-sans text-[0.7rem] text-muted-foreground [&_svg:not([class*='size-'])]:size-3",
			className,
		)}
		{...props}
	/>
);

export const NavigationPanelSearch = () => {
	const { open } = useNavigationPanel();

	return (
		<div
			className={cn(
				"flex w-full flex-col items-end gap-2 px-3",
				!open && "items-center justify-center px-0",
			)}
		>
			<Button
				className={cn(
					open && "relative w-full",
					"items-center justify-center px-2 text-muted-foreground",
				)}
				// onClick={() => setIsCommandSearchOpen(true)}
				size={open ? "sm" : "icon-sm"}
				variant="outline"
			>
				<SearchIcon className={cn(open, "size-3.5")} />
				{open && <p className="line-clamp-1 text-xs">Search</p>}
				{open && <div className="flex-1" />}
				{open && (
					<div className="flex flex-row items-center gap-0.5">
						<CommandMenuKbd>Ctrl</CommandMenuKbd>
						<CommandMenuKbd className="aspect-square">K</CommandMenuKbd>
					</div>
				)}
			</Button>
		</div>
	);
};
