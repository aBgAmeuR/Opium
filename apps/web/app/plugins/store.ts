import { LazyStore } from "@tauri-apps/plugin-store";

export default defineNuxtPlugin(nuxtApp => {
  const store = new LazyStore("store.bin", {
    autoSave: true,
  });

  return {
    provide: {
      store: store
    }
  }
})
