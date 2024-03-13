import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
    kit: {
        adapter: adapter({
            routes: {
                include: ['/*'],
                exclude: ['/assets/fonts/*'],
            },
        }),
        csrf: {
            checkOrigin: false,
        },
    },
    preprocess: vitePreprocess(),
};

export default config;
