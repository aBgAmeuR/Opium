import { Button } from "@opium/ui/components/button";
import { Cover } from "@opium/ui/components/cover";
import { Skeleton } from "@opium/ui/components/skeleton";
import {
	Tooltip,
	TooltipPopup,
	TooltipTrigger,
} from "@opium/ui/components/tooltip";
import { cn } from "@opium/ui/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, type LinkProps } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { Suspense } from "react";
import { orpc } from "@/utils/orpc";

type SidebarLibraryProps = {
	isSidebarOpen: boolean;
};

type LibraryItemProps = {
	title: string;
	imageSrc?: string;
	isSidebarOpen: boolean;
	description: string;
	to: LinkProps["to"];
	params?: LinkProps["params"];
	className?: string;
};

export const LibraryItem = ({
	title,
	imageSrc,
	isSidebarOpen,
	description,
	to,
	params,
	className,
}: LibraryItemProps) => {
	const buttonContent = (
		<Button
			render={<Link to={to} params={params} />}
			className={cn(
				isSidebarOpen && "relative w-full justify-start gap-2.5 px-2 py-1.5",
				!isSidebarOpen && "w-full justify-center px-0 py-4.5",
				"group items-center text-muted-foreground",
				className,
			)}
			size={isSidebarOpen ? "sm" : "icon-sm"}
			variant="ghost"
		>
			<div className={cn(!isSidebarOpen && "flex justify-center")}>
				<Cover
					size={isSidebarOpen ? "default" : "sm"}
					imageSrc={imageSrc}
					alt={title}
				/>
			</div>
			{isSidebarOpen && (
				<div className="flex w-full min-w-0 flex-col">
					<p className="truncate text-left text-foreground text-xs">{title}</p>
					<p className="truncate text-left text-muted-foreground text-xs">
						{description}
					</p>
				</div>
			)}
		</Button>
	);

	if (!isSidebarOpen) {
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

export const SidebarLibrary = ({ isSidebarOpen }: SidebarLibraryProps) => {
	return (
		<div
			className={cn(
				"flex w-full flex-1 min-h-0 flex-col gap-0.5 border-hard border-t border-dashed py-2",
				isSidebarOpen ? "px-3" : "px-1",
			)}
		>
			{isSidebarOpen && (
				<Button
					render={<Link to="/library" />}
					className={cn(
						"w-full justify-start text-muted-foreground",
						!isSidebarOpen && "w-auto justify-center",
					)}
					size={isSidebarOpen ? "xs" : "icon-sm"}
					variant="ghost"
				>
					{isSidebarOpen && "Your library"}
					{isSidebarOpen && <span className="inline-flex flex-1" />}
					{isSidebarOpen && <ChevronRightIcon size={14} strokeWidth={2} />}
				</Button>
			)}

			<div
				className={cn(
					"no-scrollbar flex w-full flex-1 min-h-0 flex-col gap-0 overflow-y-auto",
					!isSidebarOpen && "py-1",
				)}
			>
				<Suspense fallback={<Skeleton className="h-10 w-full" />}>
					<LibraryList isSidebarOpen={isSidebarOpen} />
				</Suspense>
			</div>
		</div>
	);
};

type LibraryListProps = {
	isSidebarOpen: boolean;
};

const LibraryList = ({ isSidebarOpen }: LibraryListProps) => {
	const library = useSuspenseQuery(orpc.library.getLibrary.queryOptions());

	if (library.isError) {
		return (
			<div>
				<p>Error loading library</p>
			</div>
		);
	}

	if (library.data?.length === 0) {
		return (
			<div className="mt-1 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-2">
				<p className="text-muted-foreground text-xs opacity-50">
					No items in your library
				</p>
			</div>
		);
	}

	return library.data
		?.sort((a, b) => b.likedAt.getTime() - a.likedAt.getTime())
		.map((item) => (
			<LibraryItem
				key={item.id.toString()}
				to={item.type === "album" ? "/album/$id" : "/playlist/$id"}
				params={{ id: item.id.toString() }}
				description={item.type === "album" ? "Album" : "Playlist"}
				imageSrc={item.image ?? undefined}
				isSidebarOpen={isSidebarOpen}
				title={item.name}
			/>
		));
};
