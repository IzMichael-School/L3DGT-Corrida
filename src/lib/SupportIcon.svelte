<script lang="ts">
    import { twMerge } from 'tailwind-merge';
    export let position = 'top-0 left-0',
        direction = 'ltr';
</script>

<a
    href="https://forms.izmichael.com/customer-support-generic?source-site=Voix"
    target="_blank"
    title="Support"
    class={twMerge(
        'group absolute z-[1000] flex h-10 w-fit items-center justify-center gap-1 p-2 opacity-20 transition-opacity duration-300 ease-in-out hover:opacity-75',
        position,
        direction == 'ltr' ? 'flex-row' : 'flex-row-reverse'
    )}
>
    <img src="/assets/icons/lifebuoy.svg" alt="Lifebuoy Icon" class="aspect-square h-6 w-6" />
    <span
        class="pb-0.5 text-base font-bold opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
    >
        Support
    </span>
</a>

<style>
</style>
