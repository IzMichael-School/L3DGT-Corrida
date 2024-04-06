<script lang="ts">
    import TextInput from '$lib/TextInput.svelte';
    import { getGravatarUrl, pb } from '$lib/pocketbase';
    import Button from '$lib/Button.svelte';
    import BooleanInput from '$lib/BooleanInput.svelte';
    import * as Toast from '$lib/toasts/toast';
    import { goto } from '$app/navigation';
    import { applyAction, enhance } from '$app/forms';

    // Declare variables
    let verificationSent = false,
        saving = false,
        savingToast: string,
        savingEmail = false,
        emailToast: string,
        savingPassword = false,
        passwordToast: string;

    // Get data from server load function
    import type { PageData } from './$types';
    export let data: PageData, form;
</script>

<svelte:head>
    <title>Dashboard | Voix</title>
</svelte:head>

<div class="flex h-full max-h-full w-full flex-col items-start justify-start gap-3 lg:flex-row lg:justify-center">
    <div class="flex w-full flex-col items-center justify-start gap-5 lg:h-full lg:w-auto lg:flex-1">
        <!-- Title -->
        <div class="flex w-full flex-col items-center justify-center rounded-lg bg-white p-5 shadow">
            <h1 class="text-center text-6xl font-bold">Welcome to Voix</h1>
        </div>

        <!-- If user's email isn't verified, show notice -->
        {#if !data.live.verified}
            <div
                class="mb-3 flex w-full flex-col items-center justify-start rounded-xl border-4 border-yellow-400 bg-white p-2 text-black shadow-md lg:mb-7 lg:px-2 lg:py-2"
            >
                <h2 class="text-lg font-bold">Your email is not yet verified</h2>
                <!-- Re-send verification email -->
                <Button
                    on:click={async () => {
                        if (verificationSent) return;
                        pb.collection('users').requestVerification(data.live.email);
                        verificationSent = true;
                    }}
                    class="mt-2 w-full bg-yellow-400 hover:bg-yellow-300"
                    variant="secondary"
                >
                    {verificationSent ? 'Done! Check your email inbox.' : 'Resend Verification Email'}
                </Button>
            </div>
        {/if}

        <!-- Push content down -->
        <span class="flex-1" />

        <div class="flex w-full flex-col items-center justify-center gap-3 rounded-lg bg-white p-5 shadow">
            <!-- Creates new room -->
            <Button
                variant="primary"
                class="justify-start bg-brand-green shadow"
                on:click={async () => {
                    const created = await fetch('/app/rooms', {
                        method: 'POST',
                    }).then((res) => res.json());
                    goto('/app/rooms/' + created.id);
                }}
            >
                <img src="/assets/icons/users-group.svg" alt="Group of People Icon" class="aspect-square w-10 invert" />
                <p class="ml-5 text-xl font-bold text-white">Create new Room</p>
            </Button>

            <!-- Creates new survey -->
            <Button
                variant="primary"
                class="justify-start bg-brand-blue shadow"
                on:click={async () => {
                    const created = await fetch('/app/surveys', {
                        method: 'POST',
                    }).then((res) => res.json());
                    goto('/app/surveys/edit/' + created.id);
                }}
            >
                <img
                    src="/assets/icons/list-numbers.svg"
                    alt="List with Numbers Icon"
                    class="aspect-square w-10 invert"
                />
                <p class="ml-5 text-xl font-bold text-white">Create new Survey</p>
            </Button>

            <!-- Navigates to home page -->
            <a href="/" class="contents">
                <Button variant="primary" class="justify-start bg-brand shadow">
                    <img
                        src="/assets/icons/door-enter.svg"
                        alt="Door with Arrow Pointing Inwards Icon"
                        class="aspect-square w-10 invert"
                    />
                    <p class="ml-5 text-xl font-bold text-white">Join a Room</p>
                </Button>
            </a>
        </div>

        <div class="flex w-full flex-col items-center justify-center gap-3 rounded-lg bg-white p-5 shadow">
            <!-- Resumes most recently edited room -->
            {#await data.recents.room then room}
                <a href="/app/rooms/{room.id}" class="contents">
                    <Button variant="primary" class="justify-start bg-brand-green shadow">
                        <img
                            src="/assets/icons/users-group.svg"
                            alt="Group of People Icon"
                            class="aspect-square w-10 invert"
                        />
                        <p class="ml-5 flex-1 text-left text-xl font-bold text-white">
                            Resume Last Room ({room.title})
                        </p>
                    </Button>
                </a>
            {/await}

            <!-- Resumes most recently edited survey -->
            {#await data.recents.survey then survey}
                <a href="/app/surveys/edit/{survey.id}" class="contents">
                    <Button variant="primary" class="justify-start bg-brand-blue shadow">
                        <img
                            src="/assets/icons/list-numbers.svg"
                            alt="List with Numbers Icon"
                            class="aspect-square w-10 invert"
                        />
                        <p class="ml-5 flex-1 text-left text-xl font-bold text-white">
                            Edit Last Survey ({survey.title})
                        </p>
                    </Button>
                </a>
            {/await}
        </div>
    </div>

    <div
        class="flex w-full flex-col items-center justify-start rounded-lg bg-white p-5 shadow lg:min-h-full lg:w-auto lg:flex-1"
    >
        <div class="flex w-full flex-1 flex-col items-center justify-center">
            <!-- Show gravatar -->
            <img
                src={getGravatarUrl(data.live.gravatarhash ?? '', data.user.gravatar ?? false)}
                alt="{data.live.displayname}'s Profile Picture"
                class="w-1/3 rounded-full shadow"
            />
            <h1 class="mt-5 text-3xl font-bold">{data.live.displayname}</h1>
            <h2 class="mt-1 text-xl font-bold">@{data.live.username}</h2>

            <!-- Update profile form -->
            <form
                method="POST"
                action="?/profile"
                class="contents"
                enctype="multipart/form-data"
                use:enhance={() => {
                    return async ({ result }) => {
                        pb.authStore.loadFromCookie(document.cookie);
                        await applyAction(result);
                        saving = false;

                        Toast.dismiss(savingToast);
                        Toast.add('Saved Changes.', {
                            type: 'success',
                        });
                        data.live = data.user;
                    };
                }}
                on:submit={() => (saving = true)}
            >
                <!-- Displayname and Username inputs -->
                <div class="flex w-full flex-row items-center justify-between gap-3">
                    <div class="flex flex-1 flex-col items-center justify-start">
                        <p class="mt-3 w-full text-left">Display Name</p>
                        <TextInput bind:value={data.user.displayname} name="displayname" class="w-full" />
                    </div>
                    <div class="flex flex-1 flex-col items-center justify-start">
                        <p class="mt-3 w-full text-left">Username</p>
                        <TextInput bind:value={data.user.username} name="username" class="w-full" />
                    </div>
                </div>

                <!-- Toggle gravatar vs generic -->
                <div class="flex w-full flex-row items-center justify-between gap-3">
                    <p class="mt-3 w-full text-left">
                        Use <a href="https://gravatar.com/" class="text-blue-500 hover:underline">Gravatar</a>
                        as Profile Picture
                    </p>
                    <BooleanInput
                        bind:value={data.user.gravatar}
                        variant="switch"
                        name="gravatar"
                        class="rounded-full"
                        classInner="rounded-full"
                    />
                </div>

                <!-- Pass user id to form handler -->
                <input name="id" class="hidden" value={data.user.id} />

                <!-- Submit form -->
                <Button
                    type="submit"
                    class="mt-3"
                    variant={saving ? 'secondary' : 'default'}
                    on:click={async () => {
                        savingToast = Toast.add('Saving...', {
                            type: 'info',
                            timeout: 60 * 60 * 1000,
                        });
                    }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>

                <!-- Show error text if form fails -->
                {#if form?.error}
                    <p class="mt-5 w-full text-center font-bold text-red-700">{form.error}</p>
                {/if}
            </form>

            <!-- Change email form -->
            <form
                method="POST"
                action="?/email"
                class="contents"
                enctype="multipart/form-data"
                use:enhance={() => {
                    return async ({ result }) => {
                        pb.authStore.loadFromCookie(document.cookie);
                        await applyAction(result);
                        savingEmail = false;

                        Toast.dismiss(emailToast);
                        Toast.add('Sent Confirmation.', {
                            type: 'success',
                            body: 'Please check your inbox.',
                        });
                    };
                }}
                on:submit={() => (savingEmail = true)}
            >
                <p class="mt-10 w-full text-left">Email Address</p>
                <TextInput bind:value={data.user.email} name="email" type="email" autocomplete="email" class="w-full" />

                <!-- Send email change confirmation -->
                <Button
                    type="submit"
                    class="mt-3"
                    variant={savingEmail ? 'secondary' : 'default'}
                    on:click={async () => {
                        emailToast = Toast.add('Sending confirmation...', {
                            type: 'info',
                            timeout: 60 * 60 * 1000,
                        });
                    }}
                >
                    {savingEmail ? 'Updating...' : 'Update Email'}
                </Button>
            </form>

            <!-- Change password form -->
            <form
                method="POST"
                action="?/password"
                class="contents"
                enctype="multipart/form-data"
                use:enhance={() => {
                    return async ({ result }) => {
                        pb.authStore.loadFromCookie(document.cookie);
                        await applyAction(result);
                        savingPassword = false;

                        Toast.dismiss(passwordToast);
                        Toast.add('Sent Confirmation.', {
                            type: 'success',
                            body: 'Please check your inbox.',
                        });
                    };
                }}
                on:submit={() => (savingPassword = true)}
            >
                <!-- Send password change confirmation -->
                <Button
                    type="submit"
                    class="mt-5"
                    variant={savingPassword ? 'secondary' : 'default'}
                    on:click={async () => {
                        passwordToast = Toast.add('Sending confirmation...', {
                            type: 'info',
                            timeout: 60 * 60 * 1000,
                        });
                    }}
                >
                    {savingPassword ? 'Updating...' : 'Update Password'}
                </Button>
            </form>
        </div>
    </div>
</div>

<style>
</style>
