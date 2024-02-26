<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Toast } from './toast';

    const dispatch = createEventDispatcher();

    export let type: Toast['type'] = 'default';
    export let dismissible = true;
</script>

<div class="flex w-full flex-row items-center justify-start rounded-lg p-2 shadow-lg {type}" role="alert">
    <p class="mb-[1px] mr-2 flex-1 font-bold text-white"><slot /></p>
    {#if dismissible}
        <button on:click={() => dispatch('dismiss')}>
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
