import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite configuration for the ChainStamp frontend.
 * Provides configuration for React plugins and build optimization.
 * 
 * @see https://vite.dev/config/
 */
export default defineConfig({
  plugins: [react()],
})
