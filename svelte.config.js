import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
    kit: {
        adapter: adapter(),
        csrf: {
            checkOrigin: false,
        },
    },
    preprocess: vitePreprocess(),
};

export default config;
