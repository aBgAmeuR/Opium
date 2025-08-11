import { createAuthClient } from "better-auth/vue";
import { setupStore } from "~/lib/store";

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  const serverUrl = config.public.serverURL

  const authClient = createAuthClient({
    baseURL: serverUrl,
    fetchOptions: {
      onSuccess: (ctx) => {
        const authToken = ctx.response.headers.get("set-auth-token") // get the token from the response headers
        // Store the token securely (e.g., in localStorage)
        if (authToken) {
          localStorage.setItem("bearer_token", authToken);
        }
      },
      auth: {
        type: "Bearer",
        token: () => localStorage.getItem("bearer_token") || "" // get the token from localStorage
      },
    },
    storage: setupStore(),
  })

  return {
    provide: {
      authClient: authClient
    }
  }
})
