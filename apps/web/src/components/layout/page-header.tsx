import { ArrowLeftIcon, ArrowRightIcon, Icon, type Icons } from "@opium/icons";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@opium/ui/components/breadcrumb";
import { Button } from "@opium/ui/components/button";
import { Link, useRouter } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

export type BreadcrumbItemData = {
	icon?: Icons;
	label: string;
	href?: string;
};

type PageHeaderProps = PropsWithChildren<{
	breadcrumbs: BreadcrumbItemData[];
}>;

export function PageHeader({ breadcrumbs, children }: PageHeaderProps) {
	const router = useRouter();

	return (
		<div className="flex items-center justify-between mb-4 -mx-2">
			<div className="flex items-center gap-4">
				<div className="flex items-center">
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Go back"
						disabled={!router.history.canGoBack()}
						onClick={() => router.history.back()}
					>
						<ArrowLeftIcon />
					</Button>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label="Go forward"
						disabled
						onClick={() => router.history.forward()}
					>
						<ArrowRightIcon />
					</Button>
				</div>

				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.flatMap((item, index) => {
							const isLast = index === breadcrumbs.length - 1;
							const elements = [
								<BreadcrumbItem key={`item-${index}`}>
									{item.icon && (
										<Icon name={item.icon} className="size-4 mr-1" />
									)}
									{item.href && !isLast ? (
										<BreadcrumbLink render={<Link to={item.href} />}>
											{item.label}
										</BreadcrumbLink>
									) : (
										<BreadcrumbPage>{item.label}</BreadcrumbPage>
									)}
								</BreadcrumbItem>,
							];

							if (!isLast) {
								elements.push(
									<BreadcrumbSeparator key={`separator-${index}`}>
										{" "}
										/{" "}
									</BreadcrumbSeparator>,
								);
							}

							return elements;
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
			<div className="flex items-center gap-1">{children}</div>
		</div>
	);
}
