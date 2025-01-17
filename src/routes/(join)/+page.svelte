<script lang="ts">
    import TextInput from '$lib/TextInput.svelte';
    import Button from '$lib/Button.svelte';
    import { goto } from '$app/navigation';

    import { applyAction, enhance } from '$app/forms';
    import Copyright from '$lib/Copyright.svelte';
    import SupportIcon from '$lib/SupportIcon.svelte';

    let loading = false,
        joinCode = '';

    // Get page data from server
    import type { PageData } from './$types';
    export let data: PageData, form;
</script>

<svelte:head>
    <title>Voix</title>
</svelte:head>

<!-- Show support link -->
<SupportIcon position="max-lg:bottom-0 lg:top-0 left-0" />

<div
    class="flex h-screen max-h-screen w-screen flex-col-reverse items-center justify-between overflow-hidden lg:flex-row"
>
    <section
        class="flex h-full max-h-full w-full flex-1 flex-col items-center justify-start overflow-y-auto shadow-lg lg:w-auto"
    >
        <div class="flex w-full flex-1 flex-col items-center justify-center px-5 py-10 lg:w-2/3 lg:px-0">
            <h1 class="text-center text-6xl font-bold">Welcome to Voix</h1>

            <p class="mt-16 w-full text-center font-bold text-gray-700">Join a Room</p>
            <!-- Join a Room form -->
            <form
                method="POST"
                class="mt-3 flex w-full flex-row"
                use:enhance={() => {
                    return async ({ result }) => {
                        await applyAction(result);
                        loading = false;
                    };
                }}
                on:submit={() => (loading = true)}
            >
                <!-- Room Code input -->
                <TextInput
                    variant="outline"
                    class="my-0 w-full text-center"
                    placeholder="Enter a code..."
                    bind:value={joinCode}
                    name="code"
                    autocomplete="off"
                />
                <!-- Only shows when room code exists -->
                <Button
                    type="submit"
                    variant={loading ? 'secondary' : 'default'}
                    class="h-11 overflow-hidden transition-all duration-300 ease-in-out {joinCode.length > 0
                        ? 'ml-3 w-11'
                        : 'ml-0 w-0 border-x-0 px-0'}"
                >
                    {loading ? '.' : '>'}
                </Button>
            </form>

            <!-- If error, return value -->
            {#if form?.error}
                <p class="mt-5 w-full text-center font-bold text-red-700">{form.error}</p>
            {/if}

            <!-- With line on either side -->
            <p class="decor-line my-8 w-full text-center font-bold text-gray-400"><span>or</span></p>

            <p class="w-full text-center font-bold text-gray-700">Log in to Host Your Own</p>
            {#if data.user}
                <!-- Shows for users already logged in -->
                <Button variant="default" class="mt-3" on:click={() => goto('/redirect')}>
                    Welcome Back, {data.user.displayname}
                </Button>
            {:else}
                <div class="mt-3 flex w-full flex-row gap-3">
                    <Button variant="default" on:click={() => goto('/login')}>Log In</Button>
                    <Button variant="secondary" on:click={() => goto('/register')}>Register</Button>
                </div>
            {/if}
        </div>

        <Copyright />
    </section>

    <!-- Left side image -->
    <section class="flex h-[25vh] w-full items-center justify-center lg:h-full lg:w-auto lg:flex-1">
        <img
            src="/assets/img/purple-microphone-unsplash.jpg"
            alt="Microphone on a Purple Background"
            class="h-full w-full object-cover"
        />
    </section>
</div>

<style>
    /* Line on either side of element with class */
    .decor-line {
        overflow: hidden;
        text-align: center;
    }
    .decor-line > span {
        position: relative;
        display: inline-block;
    }
    .decor-line > span:before,
    .decor-line > span:after {
        content: '';
        position: absolute;
        top: 50%;
        border-bottom: 1px solid rgb(156, 163, 175);
        width: 100vw;
        margin: 0 20px;
    }
    .decor-line > span:before {
        right: 100%;
    }
    .decor-line > span:after {
        left: 100%;
    }
</style>
