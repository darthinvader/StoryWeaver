/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true, // Use Vitest global APIs (describe, test, expect) without importing them
    environment: "jsdom", // Use jsdom as the testing environment
    setupFiles: "./src/setupTests.ts", // Path to your setup file (see step 3)
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    exclude: ["node_modules", "test-results", "test-examples", "tests"],
    // You might want to disable CSS parsing if it's causing issues
    // css: false,
  },
});
