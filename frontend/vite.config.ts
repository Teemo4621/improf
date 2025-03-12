import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  preview: {
    port: 5173,
  },
  server: {
    port: 5173
  }
})
