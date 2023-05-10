/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path'

// https://vitejs.dev/config/
const config = {
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: [
      '__tests__/setup/index.ts',
      '__tests__/setup/LocalStorageMock.ts',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
};

export default defineConfig(config);