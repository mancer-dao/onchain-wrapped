import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  clearScreen: false,
  plugins: [tailwindcss(), react(), tsconfigPaths()],
  server: {
    allowedHosts: [
      "farcaster-oracle-tunnel.magicdima.xyz",
      "localhost-5173.magicdima.xyz",
    ],
  },
});
