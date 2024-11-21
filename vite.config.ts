import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock'
import * as path from 'path'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())
  const isMock = env.VITE_USE_MOCK === 'true'

  return {
    plugins: [
      react(),
      viteMockServe({
        mockPath: 'src/mock',
        enable: isMock,
        watchFiles: true,
        ignore: /^\_/,
        logger: true
      })
    ],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') }
      ]
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
