import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "*.ts",
  sourcemap: true,
  dts: true,
});
