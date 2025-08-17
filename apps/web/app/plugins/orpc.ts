import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import type { RouterClient } from '@orpc/server'
import type { appRouter } from "../../../server/src/app/routes";
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const serverUrl = config.public.serverURL

  const rpcUrl = `${serverUrl}/rpc`;

  const rpcLink = new RPCLink({
    url: rpcUrl,
    headers: {
      authorization: `Bearer ${localStorage.getItem("bearer_token")}`,
    },
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  })


  const client: RouterClient<typeof appRouter> = createORPCClient(rpcLink)
  const orpcUtils = createTanstackQueryUtils(client)

  return {
    provide: {
      orpc: orpcUtils
    }
  }
})
