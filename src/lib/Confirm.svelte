<script lang="ts">
    import Modal from '$lib/Modal.svelte';
    import Button from '$lib/Button.svelte';

    export let action: () => void,
        cancel: () => void = () => {
            return;
        },
        prompt = 'Are you sure you want to do this?',
        detail = 'This action is irreversible.',
        confirmLabel = 'Confirm',
        cancelLabel = 'Cancel',
        danger = true;
    let modalShown = false;
</script>

{#if modalShown}
    <Modal on:clickOut={() => (modalShown = false)}>
        <div class="flex h-full w-full flex-col items-center justify-center p-5 lg:h-64 lg:w-[40rem]">
            <span class="flex-1" />

            <h1 class="text-2xl font-bold">{prompt}</h1>
            <p class="mt-2 text-xl">{detail}</p>

            <span class="flex-1" />

            <div class="flex w-full flex-row items-center justify-center gap-5">
                <Button
                    variant={danger ? 'danger' : 'primary'}
                    on:click={() => {
                        action();
                        modalShown = false;
                    }}
                >
                    {confirmLabel}
                </Button>
                <Button
                    variant="secondary"
                    on:click={() => {
                        cancel();
                        modalShown = false;
                    }}
                >
                    {cancelLabel}
                </Button>
            </div>
        </div>
    </Modal>
{/if}

<button on:click={() => (modalShown = true)} class="contents">
    <slot />
</button>

<style>
</style>
