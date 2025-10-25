import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["index.ts", "prisma/generated/**/*.ts"],
  sourcemap: true,
  dts: true,
});
