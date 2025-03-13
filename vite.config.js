import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import EnvironmentPlugin from 'vite-plugin-environment';

// https://vite.dev/config/
export default defineConfig(({mode}) => {
        const env = loadEnv(mode, process.cwd(), '');
        return {
            define: {
                'import.meta.env': JSON.stringify(env),
            },
            plugins: [vue(), vueDevTools(), tailwindcss(), EnvironmentPlugin('all', {prefix: 'VITE_'})],
            resolve: {
                alias: {
                    '@': fileURLToPath(new URL('./src', import.meta.url))
                },
            },
            server: {
                proxy: {
                    '/api': {
                        target: env.VITE_API_URL,
                        changeOrigin: true,
                        rewrite: (path) => path.replace(/^\/api/, '')
                    }
                }
            }
        }
    }
)
