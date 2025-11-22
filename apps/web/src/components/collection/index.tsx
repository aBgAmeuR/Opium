import type { PropsWithChildren } from "react";

export * from "./collection-hero";
export * from "./collection-nav";
export * from "./collection-table";

type CollectionProps = PropsWithChildren;

export const Collection = ({ children }: CollectionProps) => {
	return <div className="flex h-full flex-col px-6 py-4">{children}</div>;
};
