import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import { Skeleton } from "@opium/ui/components/skeleton";
import { type ContentType, ContentTypeBadge } from "./content-type-badge";

export type CatalogCardProps = {
	name: string;
	imageSrc?: string;
	description: string;
	type?: ContentType;
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
				{type && <ContentTypeBadge type={type} />}
				<p className="truncate text-left text-muted-foreground text-xs">
					{description}
				</p>
			</div>
		</div>
	</Button>
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
