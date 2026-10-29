/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 700,
  },
  // Rutas relativas: el build funciona en cualquier hosting (GitHub Pages, Netlify, Render...)
  base: './',
  test: {
    environment: 'node',
  },
})
