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
        animation: rotate 1s infinite;
        height: 50px;
        width: 50px;
    }

    .loader:before,
    .loader:after {
        border-radius: 50%;
        content: '';
        display: block;
        height: 20px;
        width: 20px;
    }
    .loader:before {
        animation: ball1 1s infinite;
        background-color: #297b4e;
        box-shadow: 30px 0 0 #654597;
        margin-bottom: 10px;
    }
    .loader:after {
        animation: ball2 1s infinite;
        background-color: #654597;
        box-shadow: 30px 0 0 #297b4e;
    }

    @keyframes rotate {
        0% {
            transform: rotate(0deg) scale(0.8);
        }
        50% {
            transform: rotate(360deg) scale(1.2);
        }
        100% {
            transform: rotate(720deg) scale(0.8);
        }
    }

    @keyframes ball1 {
        0% {
            box-shadow: 30px 0 0 #654597;
        }
        50% {
            box-shadow: 0 0 0 #654597;
            margin-bottom: 0;
            transform: translate(15px, 15px);
        }
        100% {
            box-shadow: 30px 0 0 #654597;
            margin-bottom: 10px;
        }
    }

    @keyframes ball2 {
        0% {
            box-shadow: 30px 0 0 #297b4e;
        }
        50% {
            box-shadow: 0 0 0 #297b4e;
            margin-top: -20px;
            transform: translate(15px, 15px);
        }
        100% {
            box-shadow: 30px 0 0 #297b4e;
            margin-top: 0;
        }
    }
</style>
