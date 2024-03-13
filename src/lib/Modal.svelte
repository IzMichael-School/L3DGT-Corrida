<script lang="ts">
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<button
    class="absolute inset-0 z-[1000] flex h-screen w-screen flex-col items-center justify-center bg-black/60 p-5 lg:p-0"
    transition:fade={{ duration: 300 }}
    on:mousedown|self={() => dispatch('clickOut')}
    aria-roledescription="Dimmed Background of Modal"
>
    <div class="h-full w-full cursor-default rounded-lg border-2 border-gray-300 bg-white shadow-xl lg:h-fit lg:w-fit">
        <slot />
    </div>
</button>

<style>
</style>
