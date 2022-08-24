import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
		vue()
	],
	server: {
		fs: {
		  allow: ['..']
		}
	}
})
