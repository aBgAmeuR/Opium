import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import {
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
} from "@opium/ui/components/tooltip";
import { cn } from "@opium/ui/lib/utils";
import { Link, type LinkProps } from "@tanstack/react-router";

export type MediaItemProps = {
	title: string;
	description: string;
	image?: string;
	href: LinkProps["to"];
	params?: LinkProps["params"];
	isExpanded?: boolean;
	className?: string;
};

export const MediaItem = ({
	title,
	description,
	image,
	href,
	params,
	isExpanded = true,
	className,
}: MediaItemProps) => {
	const buttonContent = (
		<Button
			render={<Link to={href} params={params} />}
			className={cn(
				isExpanded && "relative w-full justify-start gap-2.5 px-2 py-1.5",
				!isExpanded && "w-full justify-center px-0 py-4.5",
				"group items-center text-muted-foreground",
				className,
			)}
			size={isExpanded ? "sm" : "icon-sm"}
			variant="ghost"
		>
			<div className={cn(!isExpanded && "flex justify-center")}>
				<Cover
					size={isExpanded ? "default" : "sm"}
					imageSrc={image}
					alt={title}
				/>
			</div>
			{isExpanded && (
				<div className="flex w-full min-w-0 flex-col">
					<p className="truncate text-left text-foreground text-xs">{title}</p>
					<p className="truncate text-left text-muted-foreground text-xs">
						{description}
					</p>
				</div>
			)}
		</Button>
	);

	if (!isExpanded) {
		return (
			<Tooltip>
				<TooltipTrigger render={buttonContent} />
				<TooltipPopup side="right" sideOffset={4}>
					{title}
				</TooltipPopup>
			</Tooltip>
		);
	}

	return buttonContent;
};
