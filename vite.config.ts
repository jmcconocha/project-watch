import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Prevent Vite from obscuring Rust errors in Tauri
  clearScreen: false,

  // Tauri uses a fixed port
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },

  // Produce sourcemaps for debugging
  build: {
    target: 'esnext',
    sourcemap: true,
  },
})
