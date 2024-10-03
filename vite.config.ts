import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
	plugins: [react(), viteSingleFile()],
	build: {
		outDir: "server/hosting",
	},
	server: {
		proxy: {
			"/api": {
				target: "https://script.google.com/macros/s/1lLA8mmeONqpmw9h-ndG5BbEvVgjhAZ7ZsGShsWcWjsoJslG41_LDtfRc/exec", // スクリプトのURL
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
