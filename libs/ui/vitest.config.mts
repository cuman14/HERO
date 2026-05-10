import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  root: __dirname,
  plugins: [
    angular({
      tsconfig: 'tsconfig.spec.json',
    }),
    tailwindcss(),
    nxViteTsPaths(),
  ],
  envPrefix: ['VITE_', 'NX_PUBLIC_'],
  test: {
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
  },
}));
