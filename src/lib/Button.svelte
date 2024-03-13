<script lang="ts">
    import { twMerge } from 'tailwind-merge';

    export let variant: 'default' | 'primary' | 'secondary' | 'danger' = 'default';
    let xclass = '';
    export { xclass as class };

    let variants = {
        default: '',
        primary: 'border-zinc-800 bg-black hover:bg-zinc-800 text-white',
        secondary: 'border-zinc-200 bg-white hover:bg-zinc-100',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
    };
    variants.default = variants.primary;
</script>

<button
    class={twMerge(
        'flex min-h-11 w-full flex-row items-center justify-center rounded-lg border p-2 text-lg font-bold shadow transition-colors duration-300 ease-in-out active:shadow-none',
        variants[variant],
        xclass
    )}
    on:click
    {...$$restProps}
>
    <slot />
</button>

<style>
</style>
