import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/**/*.ts", "prisma/generated/*.ts"],
  sourcemap: true,
  dts: true,
});
