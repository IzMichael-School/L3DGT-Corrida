<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Toast } from './toast';

    const dispatch = createEventDispatcher();

    export let type: Toast['type'] = 'default';
    export let dismissible = true;
</script>

<div class="relative flex w-full flex-col items-center justify-start rounded-lg p-2 shadow-lg {type}" role="alert">
    <p class="min-h-6 w-full pb-[1px] pr-8 text-left font-bold text-white">
        <slot name="message" />
    </p>

    <p class="min-h-0 w-full text-left text-white">
        <slot name="body" />
    </p>

    {#if dismissible}
        <button on:click={() => dispatch('dismiss')} class="absolute right-0 top-0 m-2">
            <img src="/assets/icons/x.svg" class="h-6 w-6 invert" alt="Close Icon" />
        </button>
    {/if}
</div>

<style>
    .success {
        background-color: #3baa5f;
    }
    .danger {
        background-color: #e0061b;
    }
    .warning {
        background-color: #fe795d;
    }
    .info {
        background-color: #009ddc;
    }
    .default {
        @apply bg-gray-50;
    }
</style>
