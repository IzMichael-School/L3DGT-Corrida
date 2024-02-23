<script lang="ts">
    export let group = '',
        value: string,
        checked = false,
        variant: 'radio' | 'checkbox' | 'default' = 'default';
    export { xclass as class };
    import { twMerge } from 'tailwind-merge';
    let xclass: string | undefined;
</script>

<label class="my-1 flex cursor-pointer flex-row items-center justify-start">
    {#if variant == 'radio'}
        <div
            class={twMerge(
                'aspect-square rounded-full border-2 border-gray-100 p-2.5 transition-all duration-300 ease-in-out',
                group == value ? 'bg-blue-400' : 'bg-gray-100',
                xclass
            )}
        />
    {:else if variant == 'checkbox' || variant == 'default'}
        <div
            class={twMerge(
                'aspect-square rounded-lg border-2 border-gray-100 p-0.5 transition-all duration-300 ease-in-out',
                checked ? 'bg-blue-300' : 'bg-gray-100',
                xclass
            )}
        >
            <img
                src="/assets/icons/check.svg"
                alt="Check Mark"
                class="h-4 w-4 -translate-x-[0.0625rem] select-none transition-all duration-300 ease-in-out {checked
                    ? 'opacity-100'
                    : 'opacity-0'}"
            />
        </div>
    {/if}
    <p class="ml-2 select-none"><slot /></p>

    {#if variant == 'radio'}
        <input type="radio" {...$$restProps} class="hidden" bind:group {value} on:change />
    {:else if variant == 'checkbox' || variant == 'default'}
        <input type="checkbox" {...$$restProps} class="hidden" bind:checked {value} on:change />
    {/if}
</label>

<style>
</style>
