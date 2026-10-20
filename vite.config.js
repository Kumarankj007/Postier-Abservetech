import { defineConfig } from "vite";
//import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react";
import path from "path";
import rollupReplace from "@rollup/plugin-replace";
// https://vitejs.dev/config/
export default defineConfig({
  base: '/webadmin/',
  resolve: {
    alias: [
      {
        // "@": path.resolve(__dirname, "./src"),
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
      {
        // "@": path.resolve(__dirname, "./src"),
        find: "@components",
        replacement: path.resolve(__dirname, "./src/components"),
      },
      {
        // "@": path.resolve(__dirname, "./src"),
        find: "@routesConfig",
        replacement: path.resolve(__dirname, "./src/constant/routesConfig"),
      },
    ],
  },

  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        "process.env.NODE_ENV": JSON.stringify("development"),
      },
    }),
    react(),
    //reactRefresh(),
  ],
});
