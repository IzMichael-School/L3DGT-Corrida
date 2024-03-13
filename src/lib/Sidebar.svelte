<script lang="ts">
    import { applyAction, enhance } from '$app/forms';
    import { pb } from '$lib/pocketbase';
    import { page } from '$app/stores';
</script>

<div class="flex h-full w-64 flex-col border-r-2 border-r-gray-200 bg-white p-5">
    <div class="mb-5 flex w-full flex-row items-center justify-center">
        <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="mr-3 mt-1 h-8 w-8" />
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

    <a class="nav-button mt-5" href="/">
        <img src="/assets/icons/door-enter.svg" alt="Door with Arrow Pointing Inwards Icon" />
        <p>Join Room</p>
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
</div>

<style>
    .nav-button {
        @apply mb-2 flex flex-row items-center justify-start rounded-lg border p-2 font-bold shadow;
    }
    .nav-button:hover {
        @apply bg-zinc-100;
    }
    .nav-button.active {
        @apply bg-brand/20;
    }
    .nav-button img {
        @apply mr-2 h-5 w-5;
    }
</style>
