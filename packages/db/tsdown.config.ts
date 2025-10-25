import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["index.ts"],
  sourcemap: true,
  dts: true,
});
