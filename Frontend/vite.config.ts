import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // O vue, svelte, etc.
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

