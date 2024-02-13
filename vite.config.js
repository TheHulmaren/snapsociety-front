import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      cors: true,
    //   proxy: {
    //     import.meta.env.VITE_API_URL + "/api": {
    //       target: process.env.VITE_API_URL + import.meta.env.VITE_API_URL + "/api",
    //       changeOrigin: true,
    //       secure: false,
    //       rewrite: (path) => path.replace(/^\/api/, ""),
    //     },
    //   },
    },
  });
};
