<script lang="ts">
    import '../app.css';
    import '../fonts.css';

    import Toasts from '$lib/toasts/Toasts.svelte';
</script>

<svelte:head>
    <script defer data-domain="voix.izmichael.com" src="https://analytics.izmichael.com/js/script.js"></script>

    <!-- Primary Meta Tags -->
    <meta name="title" content="Svelte App" />
    <meta name="description" content="Lorem ipsum dolor sit amet, consectetur adipiscing." />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://example.com/" />
    <meta property="og:title" content="Svelte App" />
    <meta property="og:description" content="Lorem ipsum dolor sit amet, consectetur adipiscing." />
    <meta property="og:image" content="https://example.com/cover.png" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://example.com/" />
    <meta property="twitter:title" content="Svelte App" />
    <meta property="twitter:description" content="Lorem ipsum dolor sit amet, consectetur adipiscing." />
    <meta property="twitter:image" content="https://example.com/cover.png" />
</svelte:head>

<Toasts />
<slot />

<style>
</style>
