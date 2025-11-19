import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import { Skeleton } from "@opium/ui/components/skeleton";
import {
	Tooltip,
	TooltipPopup,
	TooltipProvider,
	TooltipTrigger,
} from "@opium/ui/components/tooltip";

type CatalogCardProps = {
	name: string;
	imageSrc?: string;
	description: string;
	type?: "leak" | "snippet" | "remastered" | "feature" | "performance" | "ai";
	onClick?: () => void;
};

export const CatalogCard = ({
	name,
	imageSrc,
	description,
	type,
	onClick,
}: CatalogCardProps) => (
	<Button
		className="relative w-36 flex-col items-start justify-start gap-2.5 p-2 text-muted-foreground"
		variant="ghost"
		onClick={onClick}
	>
		<Cover size="lg" imageSrc={imageSrc} alt={name} />
		<div className="flex w-full flex-col">
			<p className="truncate text-left text-foreground text-xs">{name}</p>
			<div className="flex items-center gap-1">
				{type && <TypeBadge type={type} />}
				<p className="truncate text-left text-muted-foreground text-xs">
					{description}
				</p>
			</div>
		</div>
	</Button>
);

const TypeBadge = ({
	type,
}: {
	type: NonNullable<CatalogCardProps["type"]>;
}) => (
	<TooltipProvider>
		<Tooltip>
			<TooltipTrigger
				className="w-fit"
				tabIndex={-1}
				render={
					<p className="flex size-3.5! items-center justify-center rounded-xs bg-foreground/20 object-cover text-[9px]" />
				}
			>
				{type.charAt(0).toUpperCase()}
			</TooltipTrigger>
			<TooltipPopup className="py-2">
				<div className="space-y-2">
					<p className="font-medium text-[13px]">Content Types</p>
					<div className="space-y-1 text-muted-foreground text-xs">
						<div className="flex items-center gap-1">
							<p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
								L
							</p>
							<p>Leak</p>
						</div>
						<div className="flex items-center gap-1">
							<p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
								S
							</p>
							<p>Snippet</p>
						</div>
						<div className="flex items-center gap-1">
							<p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
								R
							</p>
							<p>Remastered</p>
						</div>
						<div className="flex items-center gap-1">
							<p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
								F
							</p>
							<p>Feature</p>
						</div>
						<div className="flex items-center gap-1">
							<p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
								P
							</p>
							<p>Performance</p>
						</div>
						<div className="flex items-center gap-1">
							<p className="flex size-3.5 items-center justify-center rounded-xs bg-foreground/20 object-cover p-0.5 text-[9px]">
								A
							</p>
							<p>AI</p>
						</div>
					</div>
				</div>
			</TooltipPopup>
		</Tooltip>
	</TooltipProvider>
);

export const CatalogCardSkeleton = () => (
	<div className="w-36 flex flex-col items-start justify-start gap-2.5 p-2">
		<Skeleton className="size-32 rounded-[4px]" />
		<div className="flex w-full flex-col gap-0.5">
			<Skeleton className="h-4 w-24" />
			<div className="flex items-center gap-1">
				<Skeleton className="h-4 w-16" />
			</div>
		</div>
	</div>
);
