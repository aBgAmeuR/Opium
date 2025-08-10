import { createAuthClient } from "better-auth/vue";
import { setupStore } from "~/lib/store";

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  const serverUrl = config.public.serverURL

  const authClient = createAuthClient({
    baseURL: serverUrl,
    fetchOptions: {
      customFetchImpl: fetch,
    },
    storage: setupStore(),
  })

  return {
    provide: {
      authClient: authClient
    }
  }
})
