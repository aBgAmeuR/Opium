import type { PropsWithChildren } from "react";
import { type BreadcrumbItemData, PageHeader } from "../layout/page-header";

type CollectionNavProps = PropsWithChildren<{
	breadcrumbs: BreadcrumbItemData[];
}>;

export const CollectionNav = ({
	breadcrumbs,
	children,
}: CollectionNavProps) => {
	return <PageHeader breadcrumbs={breadcrumbs}>{children}</PageHeader>;
};
