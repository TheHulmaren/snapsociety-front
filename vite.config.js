import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dotenv from "dotenv";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default ({ mode }) => {
  dotenv.config({ path: `./.env` });

  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: process.env.VITE_API_URL + "/api",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  });
};
