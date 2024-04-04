<script lang="ts">
    import { applyAction, enhance } from '$app/forms';
    import { pb } from '$lib/pocketbase';
    import { page } from '$app/stores';
    import Copyright from '$lib/Copyright.svelte';
</script>

<div
    class="flex w-full flex-row justify-between gap-3 overflow-x-auto rounded-t-xl border-t-2 border-r-gray-200 bg-white p-3 shadow-lg lg:mt-0 lg:h-full lg:w-64 lg:flex-col lg:justify-start lg:gap-0 lg:overflow-x-hidden lg:rounded-none lg:border-r-2 lg:border-t-0 lg:p-5"
>
    <div class="mb-5 hidden w-full flex-row items-center justify-center lg:flex">
        <img src="/favicon.png" alt="Voix Logo" class="mr-3 mt-1 h-8 w-8" />
        <h1 class="font-jura text-4xl font-bold text-brand">Voix</h1>
    </div>

    <a class="nav-button" class:active={$page.route.id == '/app'} href="/app">
        <img src="/assets/icons/layout-dashboard.svg" alt="Dashboard Icon" />
        <p>Dashboard</p>
    </a>

    <a class="nav-button" class:active={$page.route.id?.startsWith('/app/surveys')} href="/app/surveys">
        <img src="/assets/icons/list-numbers.svg" alt="List with Numbers Icon" />
        <p>Surveys</p>
    </a>

    <a class="nav-button" class:active={$page.route.id?.startsWith('/app/rooms')} href="/app/rooms">
        <img src="/assets/icons/users-group.svg" alt="Group of People Icon" />
        <p>Rooms</p>
    </a>

    <a class="nav-button lg:mt-5" href="/">
        <img src="/assets/icons/door-enter.svg" alt="Door with Arrow Pointing Inwards Icon" />
        <p>Join Room</p>
    </a>

    <a class="nav-button" href="https://forms.izmichael.com/customer-support-generic?source-site=Voix" target="_blank">
        <img src="/assets/icons/lifebuoy.svg" alt="Lifebuoy Icon" />
        <p>Support</p>
    </a>

    <form
        method="POST"
        action="/logout"
        use:enhance={() => {
            return async ({ result }) => {
                pb.authStore.clear();
                await applyAction(result);
            };
        }}
        class="contents"
    >
        <button class="nav-button">
            <img src="/assets/icons/logout.svg" alt="Leaving through Door Icon" />
            <p>Log Out</p>
        </button>
    </form>

    <span class="hidden flex-1 lg:block" />

    <div class="hidden lg:contents">
        <Copyright />
    </div>
</div>

<style>
    .nav-button {
        /* eslint-disable-next-line svelte/valid-compile */
        @apply flex flex-1 flex-col items-center justify-start whitespace-nowrap rounded-lg border p-2 px-5 text-center font-bold shadow lg:mb-2 lg:flex-none lg:flex-row lg:px-2 lg:text-left;
    }
    .nav-button:hover {
        @apply bg-zinc-100;
    }
    .nav-button.active {
        @apply bg-brand/20;
    }
    .nav-button img {
        /* eslint-disable-next-line svelte/valid-compile */
        @apply h-7 w-7 lg:mr-2 lg:h-5 lg:w-5;
    }
</style>
