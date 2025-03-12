import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      // Ensure external dependencies are bundled correctly
      external: [],
    },
  },
  resolve: {
    alias: {
      // Optional: Explicitly map imports if needed
      "react-parallax-tilt": "react-parallax-tilt/dist/index.js",
      "react-router-dom": "/node_modules/react-router-dom/dist/index.js",
    },
  },
});
