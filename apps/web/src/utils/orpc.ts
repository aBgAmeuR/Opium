import { appRouter } from "@opium/api";
import { createContext } from "@opium/api/context";
import { toastManager } from "@opium/ui/components/toast";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60,
		},
	},
	queryCache: new QueryCache({
		onError: (error) => {
			toastManager.add({
				title: `Error: ${error.message}`,
				description: error.message,
				type: "error",
				actionProps: {
					children: "retry",
					onClick: () => {
						queryClient.invalidateQueries();
					},
				},
			});
		},
	}),
});

const getORPCClient = createIsomorphicFn()
	.server(() =>
		createRouterClient(appRouter, {
			context: ({ context }) => createContext({ context }),
		}),
	)
	.client((): RouterClient<typeof appRouter> => {
		const link = new RPCLink({
			url: `${import.meta.env.VITE_SERVER_URL}/api/rpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
		});

		return createORPCClient(link);
	});

export const client: RouterClient<typeof appRouter> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
