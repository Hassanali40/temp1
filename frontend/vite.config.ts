import { resolve } from 'path'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = resolve(__dirname)
// const outDir = resolve(__dirname, 'dist')

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "../dist/static",
        emptyOutDir: true,
        sourcemap: true,
        rollupOptions: {
          input: {
            main: resolve(root, 'index.html'),
            admin: resolve(root, 'admin.html'),
            mainpage: resolve(root, 'main.html')
          }
        }
    },
    server: {
        proxy: {
            "/api": {
                target: "http://127.0.0.1:5000",
                changeOrigin: true,
                secure: false
            }
        }
    }
});
