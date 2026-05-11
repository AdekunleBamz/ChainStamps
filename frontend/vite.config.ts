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
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'stacks-vendor': ['@stacks/connect', '@stacks/network', '@stacks/transactions'],
          'walletconnect-vendor': ['@walletconnect/universal-provider', '@walletconnect/sign-client'],
          'framer-vendor': ['framer-motion'],
          'reown-vendor': ['@reown/appkit', '@reown/appkit-adapter-wagmi'],
        },
      },
    },
  },
})
