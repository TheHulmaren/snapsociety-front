import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      vue(),
      ckeditor5( { theme: require.resolve( '@ckeditor/ckeditor5-theme-lark' ) } )
    ],
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
