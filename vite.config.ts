import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// VITE_ARTIFACT=1 genera una build con rutas relativas para publicarla como Artifact de claude.ai.
const artifact = process.env.VITE_ARTIFACT === '1'

export default defineConfig({
  base: artifact ? './' : '/',
  plugins: [react(), tailwindcss()],
})
