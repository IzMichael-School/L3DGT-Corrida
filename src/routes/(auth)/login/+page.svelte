<script lang="ts">
    import { applyAction, enhance } from '$app/forms';
    import { pb } from '$lib/pocketbase';

    export let form;
    import Button from '$lib/Button.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    let loading = false;

    onMount(() => {
        if (pb.authStore.isValid) goto('/app');
    });
</script>

<svelte:head>
    <title>Log In | Voix</title>
</svelte:head>

<form
    method="POST"
    class="flex h-full w-full flex-col items-center justify-center"
    use:enhance={() => {
        return async ({ result }) => {
            pb.authStore.loadFromCookie(document.cookie);
            await applyAction(result);
            loading = false;
        };
    }}
    on:submit={() => (loading = true)}
>
    <h1 class="font-title mb-3 w-full text-center text-3xl font-bold">Log In to Voix</h1>
    <a href="/register" class="mb-2 text-center font-medium hover:underline">
        Don't have an account? Click here to Register.
    </a>

    <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Username or Email</p>
    <TextInput class="w-full" name="username" placeholder="johndoe@email.tld" autocomplete="username" />

    <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Password</p>
    <TextInput class="w-full" name="password" placeholder="********" autocomplete="current-password" type="password" />

    <Button type="submit" class="mt-5 w-full" variant={loading ? 'secondary' : 'default'}>
        {loading ? 'Loading...' : 'Log In'}
    </Button>

    {#if form?.error}
        <p class="mt-5 w-full text-center font-bold text-red-700">{form.error}</p>
    {/if}
</form>
