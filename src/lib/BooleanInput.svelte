<script lang="ts">
    export let value: boolean,
        name = '',
        variant: keyof typeof variants = 'default',
        classInner = '';
    export { xclass as class };
    import { twMerge } from 'tailwind-merge';
    let xclass: string | undefined;

    let variants = {
        switch: {
            wrapper: 'w-12 h-6',
            inner: 'w-4 h-4',
            innerTrue: 'ml-7 bg-green-600',
        },
        slider: {
            wrapper: 'w-[17.5rem] h-9',
            inner: 'w-[8.375rem] h-7 bg-blue-300',
            innerTrue: 'ml-[8.875rem] bg-blue-300',
        },
        default: {
            wrapper: '',
            inner: '',
            innerTrue: '',
        },
    };
    variants.default = variants.switch;
</script>

<label
    class={twMerge(
        'relative mt-1 flex cursor-pointer flex-row items-center gap-1 overflow-hidden bg-gray-100 p-1',
        variants[variant].wrapper,
        xclass
    )}
>
    <span
        class={twMerge(
            'absolute inset-0 m-1 block bg-red-600 transition-all duration-300 ease-in-out',
            variants[variant].inner,
            value ? variants[variant].innerTrue : '',
            classInner
        )}
    />

    <p class="z-50 flex-1 select-none text-center font-bold">
        <slot name="false" />
    </p>
    <input type="checkbox" {name} {...$$restProps} bind:checked={value} class="invisible h-0 w-0 overflow-hidden" />
    <p class="z-50 flex-1 select-none text-center font-bold">
        <slot name="true" />
    </p>
</label>

<style>
</style>
