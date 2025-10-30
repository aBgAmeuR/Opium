import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { isAdminFn } from "@/functions/auth";

export const Route = createFileRoute("/_app/_admin")({
	component: RouteComponent,
	beforeLoad: async () => {
		if (!isAdminFn()) {
			throw redirect({ to: "/dashboard" });
		}
	},
});

function RouteComponent() {
	return <Outlet />;
}
