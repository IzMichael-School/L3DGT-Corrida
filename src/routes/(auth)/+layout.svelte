<script lang="ts">
    import Copyright from '$lib/Copyright.svelte';
</script>

<div class="flex h-screen max-h-screen w-screen flex-row items-center justify-between overflow-hidden">
    <section class="flex h-full max-h-full flex-1 flex-col items-center justify-start overflow-y-auto shadow-lg">
        <a href="/" class="w-full p-2 text-left hover:underline">&leftarrow; Return Home</a>

        <div class="flex w-full flex-1 flex-col items-center justify-center px-5 py-2 lg:w-2/3 lg:px-0">
            <slot />
        </div>

        <Copyright />
    </section>

    <section class="relative hidden h-full flex-1 items-center justify-center lg:flex">
        <img
            src="/assets/img/lock-unsplash.jpg"
            alt="Rusting Lock on a Chain Fence"
            class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 z-10 h-full w-full bg-purple-400/20" />
    </section>
</div>

<style>
</style>
