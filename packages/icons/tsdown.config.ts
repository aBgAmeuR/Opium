import { defineConfig } from "tsdown";

export default defineConfig({
	clean: true,
	entry: ["src/**/*.ts", "src/**/*.tsx"],
	format: ["esm"],
	sourcemap: true,
	minify: true,
	dts: true,
	target: "esnext",
	outDir: "dist",
});
