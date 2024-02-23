<script lang="ts">
    export let value = '',
        name = '',
        placeholder = '',
        variant: keyof typeof variants = 'default',
        rows = 1;
    export { xclass as class };
    import { twMerge } from 'tailwind-merge';
    let xclass: string | undefined;

    const variants = {
        filled: 'bg-gray-100 text-black hover:bg-gray-200',
        outline: 'bg-transparent border border-gray-400 hover:bg-gray-100 hover:border-gray-900',
        ghost: 'bg-transparent hover:bg-gray-100',
        default: '',
    };
    variants.default = variants.filled;
</script>

{#if rows == 1}
    <input
        {name}
        {placeholder}
        {...$$restProps}
        bind:value
        class={twMerge(
            'my-1 min-w-[12rem] rounded-lg p-2 font-normal outline-none transition-colors duration-200 ease-in-out',
            variants[variant],
            xclass
        )}
        on:change
        on:keydown
        on:keyup
    />
{:else}
    <textarea
        {name}
        {placeholder}
        {...$$restProps}
        bind:value
        {rows}
        class={twMerge(
            'my-1 min-w-[12rem] resize-none rounded-lg p-2 font-normal outline-none transition-colors duration-200 ease-in-out',
            variants[variant],
            xclass
        )}
        on:change
        on:keydown
        on:keyup
    />
{/if}

<style>
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type='number'] {
        appearance: textfield;
    }
</style>
