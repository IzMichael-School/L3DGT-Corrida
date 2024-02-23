<script lang="ts">
    import { applyAction, enhance } from '$app/forms';
    import { pb } from '$lib/pocketbase';

    export let form;
    import Button from '$lib/Button.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import PasswordStrength from '$lib/PasswordStrength.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let password = '',
        loading = false;

    onMount(() => {
        if (pb.authStore.isValid) goto('/app');
    });
</script>

<svelte:head>
    <title>Register | Voix</title>
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
    <h1 class="font-title mb-3 w-full text-center text-3xl font-bold">Register for Voix</h1>
    <a href="/login" class="mb-2 text-center font-medium hover:underline">
        Already have an account? Click here to Log In.
    </a>

    <p class="ml-1 mt-5 text-base font-semibold text-black">Username</p>
    <TextInput name="username" placeholder="JohnDoe12" autocomplete="username" class="w-full" />
    <p class="text-sm">This must be unique.</p>

    <p class="ml-1 mt-5 text-base font-semibold text-black">Email Address</p>
    <TextInput name="email" placeholder="johndoe@email.tld" autocomplete="email" class="w-full" />
    <p class="text-sm">This must be unique.</p>

    <p class="ml-1 mt-5 text-base font-semibold text-black">Password</p>
    <TextInput
        name="password"
        placeholder="********"
        autocomplete="new-password"
        bind:value={password}
        class="w-full"
        type="password"
    />
    <p class="mb-5 text-sm">This must be between 8 and 72 characters, with no spaces.</p>

    <PasswordStrength bind:value={password} class="w-full" />

    <p class="ml-1 mt-5 text-base font-semibold text-black">Confirm Password</p>
    <TextInput
        name="passwordConfirm"
        placeholder="********"
        autocomplete="new-password"
        class="w-full"
        type="password"
    />
    <Button type="submit" class="mt-5 w-full" variant={loading ? 'secondary' : 'default'}>
        {loading ? 'Loading...' : 'Register'}
    </Button>

    {#if form?.error}
        <p class="mt-5 w-full text-center font-bold text-red-700">{form.error}</p>
    {/if}
</form>

<style>
    p {
        @apply w-full text-left;
    }
</style>
