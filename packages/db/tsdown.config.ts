import { defineConfig } from "tsdown";

export default defineConfig({
	clean: true,
	entry: "src/**/*.ts",
	format: ["esm"],
	sourcemap: true,
	minify: true,
	dts: true,
	target: "esnext",
	outDir: "dist",
});
