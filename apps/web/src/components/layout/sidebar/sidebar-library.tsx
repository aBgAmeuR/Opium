import { Button } from "@opium/ui/components/button";
import { Skeleton } from "@opium/ui/components/skeleton";
import { cn } from "@opium/ui/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { Suspense } from "react";
import { MediaItem } from "@/components/media-item";
import { orpc } from "@/utils/orpc";
import { useSidebar } from "./sidebar-provider";

export const SidebarLibrary = () => {
	const { open } = useSidebar();

	return (
		<div
			className={cn(
				"flex w-full flex-1 min-h-0 flex-col gap-0.5 border-hard border-t border-dashed py-2",
				open ? "px-3" : "px-1",
			)}
		>
			{open && (
				<Button
					render={<Link to="/library" />}
					className={cn(
						"w-full justify-start text-muted-foreground",
						!open && "w-auto justify-center",
					)}
					size={open ? "xs" : "icon-sm"}
					variant="ghost"
				>
					{open && "Your library"}
					{open && <span className="inline-flex flex-1" />}
					{open && <ChevronRightIcon size={14} strokeWidth={2} />}
				</Button>
			)}

			<div
				className={cn(
					"no-scrollbar flex w-full flex-1 min-h-0 flex-col gap-0 overflow-y-auto",
					!open && "py-1",
				)}
			>
				<Suspense fallback={<Skeleton className="h-10 w-full" />}>
					<LibraryList isSidebarOpen={open} />
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
			<MediaItem
				key={`${item.type}-${item.id}`}
				href={item.type === "album" ? "/album/$id" : "/playlist/$id"}
				params={{ id: item.id.toString() }}
				description={item.type === "album" ? "Album" : "Playlist"}
				image={item.image ?? undefined}
				isExpanded={isSidebarOpen}
				title={item.name}
			/>
		));
};
