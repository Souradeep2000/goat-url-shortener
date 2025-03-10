import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": undefined, // Remove COOP
      "Cross-Origin-Embedder-Policy": undefined, // Also remove COEP if set
    },
  },
});
