import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    projects: [
      {
        resolve: {
          alias: {
            '@': resolve(__dirname, './src'),
          },
        },
        test: {
          name: 'unit',
          include: ['src/**/*.unit.test.ts'],
          environment: 'node',
          globals: false,
        },
      },
      {
        resolve: {
          alias: {
            '@': resolve(__dirname, './src'),
          },
        },
        test: {
          name: 'eval',
          include: ['src/**/*.eval.test.ts'],
          environment: 'node',
          globals: false,
          testTimeout: 60_000,
          maxWorkers: 1,
          minWorkers: 1,
          setupFiles: ['src/__tests__/helpers/eval-setup.ts'],
        },
      },
    ],
  },
})
