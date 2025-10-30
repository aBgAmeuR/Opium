import { Button } from "@opium/ui/components/button";
import { cn } from "@opium/ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { CatalogCard } from "@/components/catalog-card";
import { types } from "@/constants/types";

export const Route = createFileRoute("/_app/explore")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<main className="flex flex-col gap-4 p-6">
			<div>
				<h1 className="font-bold text-2xl tracking-tight">Explore</h1>
				<p className="text-muted-foreground text-sm">
					Discover new tracks, leaks, and unreleased music
				</p>
			</div>
			<div>
				<h2 className="font-bold text-lg tracking-tight">Browse by Type</h2>
				<div className="mt-2 grid grid-cols-4 gap-2 lg:grid-cols-5 xl:grid-cols-6">
					{types.map((type) => (
						<Button
							className={cn(
								type.color,
								"flex aspect-video w-full flex-col items-center justify-center gap-1.5 text-white",
							)}
							key={type.name}
							variant="ghost"
						>
							{type.icon}
							<p className="font-medium tracking-tight">{type.name}</p>
						</Button>
					))}
				</div>
			</div>
			<div>
				<h2 className="font-bold text-lg tracking-tight">New Releases</h2>
				<div className="flex">
					<CatalogCard
						description="Playboi Carti"
						imageSrc="https://cdn-images.dzcdn.net/images/cover/3c5f5f3f5f41ff96f961afd7df7eb4d9/0x1900-000000-80-0-0.jpg"
						name="Whole Lotta Red"
						type="leak"
					/>
					<CatalogCard
						description="Playboi Carti"
						imageSrc="https://cdn-images.dzcdn.net/images/cover/f2d66b587ca8d3f0fa222c3501d23564/1900x1900-000000-81-0-0.jpg"
						name="Die Lit"
						type="snippet"
					/>
					<CatalogCard
						description="Playboi Carti"
						imageSrc="https://cdn-images.dzcdn.net/images/cover/0ae8e05f734268cbe5aae06f96f2b1f2/0x1900-000000-80-0-0.jpg"
						name="Playboi Carti"
						type="performance"
					/>
				</div>
			</div>
		</main>
	);
}
