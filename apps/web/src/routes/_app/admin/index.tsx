import { Button } from "@opium/ui/components/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from "@opium/ui/components/card";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { isAdmin as isAdminFn } from "@/functions/auth";

export const Route = createFileRoute("/_app/admin/")({
	component: RouteComponent,
	beforeLoad: async () => {
		const isAdmin = await isAdminFn();
		if (!isAdmin) {
			throw redirect({ to: "/dashboard" });
		}
	},
});

function RouteComponent() {
	const adminSections = [
		{
			title: "Manage Tracks",
			description: "Add, edit, and manage all tracks",
			href: "/admin/tracks",
		},
		{
			title: "Manage Artists",
			description: "Add, edit, and manage artists",
			href: "/admin/artists",
		},
		{
			title: "Manage Albums",
			description: "Add, edit, and manage albums",
			href: "/admin/albums",
		},
	];

	return (
		<main className="flex flex-col gap-6 p-6">
			<h1 className="font-bold text-3xl tracking-tight">Admin Dashboard</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{adminSections.map((section) => {
					return (
						<Link key={section.href} to={section.href}>
							<Card className="cursor-pointer h-full">
								<CardHeader className="flex items-center justify-between">
									<div className="flex flex-col gap-1">
										<CardTitle>{section.title}</CardTitle>
										<CardDescription>{section.description}</CardDescription>
									</div>
									<ChevronRight className="size-4" />
								</CardHeader>
							</Card>
						</Link>
					);
				})}
			</div>
		</main>
	);
}
