import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

const defaultConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
};

export default defineConfig(({ command, mode }) => {
  if (command === "serve") {
    const isDev = mode === "development";

    return {
      ...defaultConfig,
      server: {
        proxy: {
          "/api": {
            target: isDev
              ? "http://localhost:5000"
              : "https://agri-map-58go.onrender.com",
            // changeOrigin: isDev,
            // secure: !isDev,
          },
        },
      },
    };
  } else {
    return defaultConfig;
  }
});
