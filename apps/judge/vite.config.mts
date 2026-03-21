/// <reference types='vitest' />
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from '@tailwindcss/vite';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/judge',
  build: {
    outDir: '../../dist/apps/judge',
    emptyOutDir: true,
    reportCompressedSize: true,
    target: 'esnext',
  },
  server: {
    port: 4200,
    host: '0.0.0.0',
  },
  envPrefix: ['VITE_', 'NX_PUBLIC_'],
  plugins: [
    angular(),
    tailwindcss(),
    nxViteTsPaths(),
    viteStaticCopy({
      targets: [
        // Adjust common assets if they exist
        // {
        //   src: '../../libs/shared/assets/**/*',
        //   dest: 'assets',
        // },
      ],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
