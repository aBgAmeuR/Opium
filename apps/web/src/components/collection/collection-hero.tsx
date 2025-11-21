import { cn } from "@opium/ui/lib/utils";
import type { PropsWithChildren, ReactNode } from "react";
import { Cover } from "../../../../../packages/ui/src/components/cover";

interface CollectionHeaderProps {
	imageSrc: string;
	imageAlt: string;
	title: string;
	subtitle: string;
	metadata: ReactNode;
	className?: string;
}

export function CollectionHeader({
	imageSrc,
	imageAlt,
	title,
	subtitle,
	metadata,
	className,
}: CollectionHeaderProps) {
	return (
		<div className={cn("mb-8 flex gap-6", className)}>
			<Cover size="lg" variant="blur" imageSrc={imageSrc} alt={imageAlt} />

			<div className="flex flex-col justify-end">
				<p className="text-sm text-muted-foreground capitalize">{subtitle}</p>
				<div className="text-4xl font-bold leading-tight">{title}</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					{metadata}
				</div>
			</div>
		</div>
	);
}

export const CollectionHero = ({ children }: PropsWithChildren) => {
	return <div className="mb-4 flex gap-4">{children}</div>;
};

export const CollectionHeroImage = ({
	imageSrc,
	imageAlt,
}: {
	imageSrc: string;
	imageAlt: string;
}) => {
	return <Cover size="lg" variant="blur" imageSrc={imageSrc} alt={imageAlt} />;
};

export const CollectionHeroInfo = ({
	subtitle,
	title,
	children,
}: PropsWithChildren<{ title: string; subtitle: string }>) => {
	return (
		<div className="flex flex-col justify-end">
			<p className="text-sm text-muted-foreground capitalize">{subtitle}</p>
			<div className="text-4xl font-bold leading-tight">{title}</div>
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				{children}
			</div>
		</div>
	);
};
