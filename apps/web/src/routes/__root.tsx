import { Providers } from "@opium/ui/providers";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { orpc } from "@/utils/orpc";
import appCss from "../index.css?url";

export type RouterAppContext = {
	orpc: typeof orpc;
	queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Opium",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg",
			},
			{ rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
			{ rel: "icon", href: "/favicon.ico" },
		],
	}),

	component: RootDocument,
});

function RootDocument() {
	return (
		<html className="dark" lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="bg-background font-sans text-primary antialiased">
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<Outlet />
					</div>
					{/* <TanStackRouterDevtools position="bottom-left" /> */}
					{/* <ReactQueryDevtools buttonPosition="bottom-right" position="bottom" /> */}
					<Scripts />
				</Providers>
			</body>
		</html>
	);
}
