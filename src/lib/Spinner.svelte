<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    onMount(() => {
        timer = setTimeout(() => {
            shown = true;
        }, 500);
    });

    onDestroy(() => {
        clearTimeout(timer);
    });

    let shown = false,
        timer: ReturnType<typeof setTimeout>;
</script>

<div
    class="absolute inset-0 z-[1000] flex h-screen w-screen flex-col items-center justify-center bg-black/60 p-5 lg:p-0"
    transition:fade={{ duration: 300 }}
>
    {#if shown}
        <div
            class="flex aspect-square items-center justify-center rounded-lg border-2 border-gray-300 bg-white p-16 shadow-xl"
            transition:fade={{ duration: 300 }}
        >
            <span class="loader" />
        </div>
    {/if}
</div>

<style>
    .loader {
        width: 128px;
        height: 128px;
        display: inline-block;
        position: relative;
    }
    .loader::after,
    .loader::before {
        content: '';
        box-sizing: border-box;
        width: 128px;
        height: 128px;
        border: 8px solid;
        @apply border-brand-green;
        position: absolute;
        left: 0;
        top: 0;
        animation: rotation 2s ease-in-out infinite alternate;
    }
    .loader::after {
        @apply border-brand;
        animation-direction: alternate-reverse;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
