//// <reference types='vitest' />
import { Plugin, defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { augmentAppWithServiceWorker } from '@angular/build/private';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function swBuildPlugin(): Plugin {
  let isSsr: boolean | undefined;
  return {
    name: 'analog-sw',
    configResolved(config) {
      isSsr = config.build?.ssr;
    },
    async closeBundle() {
      if (isSsr) return;
      console.log('Generating Angular service worker');
      const outputPath = resolve(__dirname, '../../dist/apps/judge');
      await augmentAppWithServiceWorker('apps/judge', process.cwd(), outputPath, '/');
    },
  };
}

export default defineConfig(({ mode }) => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/judge',
  build: {
    outDir: '../../dist/apps/judge',
    emptyOutDir: true,
    reportCompressedSize: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'supabase';
            }
            if (id.includes('rxjs') || id.includes('@ngrx')) {
              return 'vendor';
            }
            return 'vendor';
          }
        },
      },
    },
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
    swBuildPlugin(),
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
