import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { threlteStudio } from '@threlte/studio/vite';
import { aiRobots } from '@silentsilas/vite-plugin-ai-robots';

export default defineConfig({
	plugins: [
		threlteStudio(),
		sveltekit(),
		aiRobots({
			accessToken: process.env.DARK_VISITORS_TOKEN || ''
		})
	],
	ssr: {
		noExternal: ['three', 'three-inspect']
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
