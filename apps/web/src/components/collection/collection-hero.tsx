import { cn } from "@opium/ui/lib/utils";
import type { PropsWithChildren } from "react";
import { Cover } from "../../../../../packages/ui/src/components/cover";

export const CollectionHero = ({ children }: PropsWithChildren) => {
	return <div className="mb-4 flex gap-4">{children}</div>;
};

export const CollectionHeroImage = ({
	imageSrc,
	imageAlt,
}: {
	imageSrc?: string;
	imageAlt: string;
}) => {
	return <Cover size="lg" variant="blur" imageSrc={imageSrc} alt={imageAlt} />;
};

export const CollectionHeroInfo = ({
	subtitle,
	title,
	children,
	className,
}: PropsWithChildren<{
	title: string;
	subtitle: string;
	className?: string;
}>) => {
	return (
		<div className="flex flex-col justify-end">
			<p className="text-sm text-muted-foreground capitalize">{subtitle}</p>
			<div className="text-4xl font-bold line-clamp-2 break-all">{title}</div>
			<div
				className={cn(
					"h-7 flex items-center gap-2 text-sm text-muted-foreground",
					className,
				)}
			>
				{children}
			</div>
		</div>
	);
};
