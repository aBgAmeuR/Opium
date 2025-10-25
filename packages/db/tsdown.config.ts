import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "src/**/*.ts",
  sourcemap: true,
  dts: true,
  external: ["@prisma/client", "./prisma/generated"],
  platform: "node",
});
