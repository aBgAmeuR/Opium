// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "latest",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  devServer: {
    host: "0.0.0.0",
    port: 3001,
  },
  ssr: false,
  runtimeConfig: {
    public: {
      serverURL: process.env.NUXT_PUBLIC_SERVER_URL,
    },
  },
  vite: {
    clearScreen: false,
    envPrefix: ["VITE_", "TAURI_"],
    server: {
      strictPort: true,
      hmr: {
        protocol: "ws",
        host: "0.0.0.0",
        port: 3000,
      },
      watch: {
        ignored: ["**/src-tauri/**"],
      },
    },
  },
});
