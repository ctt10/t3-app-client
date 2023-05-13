/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    reporters: ["default", "html"],
    coverage: {
      provider: 'istanbul', // or 'c8'
    },
    setupFiles: [
      '__tests__/setup/index.ts',
      '__tests__/setup/setup-teardown-hook.ts',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
});