<script lang="ts">
    import { flip } from 'svelte/animate';
    import Toast from './Toast.svelte';
    import { dismiss, toasts } from './toast';
    import { fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';
</script>

{#if $toasts}
    <div class="fixed right-0 top-0 z-[5000] mr-5 mt-5 flex w-72 flex-col items-center justify-start gap-3">
        {#each $toasts as toast (toast.id)}
            <div
                class="w-full"
                animate:flip={{ duration: 600, easing: cubicInOut }}
                in:fly={{ duration: 600, opacity: 1, y: -200, easing: cubicInOut }}
                out:fly={{ duration: 600, opacity: 1, x: 500, easing: cubicInOut }}
            >
                <Toast type={toast.type} dismissible={toast.dismissible} on:dismiss={() => dismiss(toast.id ?? '')}>
                    {toast.message}
                </Toast>
            </div>
        {/each}
    </div>
{/if}

<style></style>
