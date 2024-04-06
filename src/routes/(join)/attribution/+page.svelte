<script lang="ts">
    import Button from '$lib/Button.svelte';
    import { goto } from '$app/navigation';

    import SupportIcon from '$lib/SupportIcon.svelte';
</script>

<svelte:head>
    <title>Attribution | Voix</title>
</svelte:head>

<SupportIcon position="max-lg:bottom-0 lg:top-0 left-0" />

<div
    class="flex h-screen max-h-screen w-screen flex-col-reverse items-center justify-between overflow-hidden lg:flex-row"
>
    <section
        class="flex h-full max-h-full w-full flex-1 flex-col items-center justify-start overflow-y-auto shadow-lg lg:w-auto"
    >
        <div class="flex w-full flex-1 flex-col items-center justify-center px-5 py-10 lg:w-2/3 lg:px-0">
            <h1 class="text-center text-4xl font-bold">Attribution</h1>

            <!-- Context -->
            <p class="mt-16">
                Voix was developed with ❤ by <a href="https://izmichael.com">IzMichael.</a>
            </p>
            <p class="mt-1">
                Created for a <a href="https://www.nzqa.govt.nz/ncea/assessment/view-detailed.do?standardNumber=91903">
                    L3-DGT assessment.
                </a>
            </p>

            <!-- Images -->
            <p class="mt-8">
                Microphone image is from <a href="https://unsplash.com/@mattbotsford?utm_content=creditCopyText">
                    Matt Botsford
                </a>
                on
                <a
                    href="https://unsplash.com/photos/condenser-microphone-with-black-background-OKLqGsCT8qs?utm_content=creditCopyText"
                >
                    Unsplash.
                </a>
            </p>
            <p class="mt-1">
                Lock image is from <a href="https://unsplash.com/@mr_williams_photography?utm_content=creditCopyText">
                    Micah Williams
                </a>
                on
                <a
                    href="https://unsplash.com/photos/black-and-gray-code-padlock-anchored-on-chain-link-fence-selective-focus-photo-lmFJOx7hPc4?utm_content=creditCopyText"
                >
                    Unsplash.
                </a>
            </p>

            <!-- Icons, Fonts, Tech -->
            <p class="mt-8">
                Icons are from <a href="https://tabler.io/icons">Tabler Icons.</a>
            </p>
            <p class="mt-1">
                Main font used is <a href="https://fonts.google.com/specimen/Jura">
                    Jura, by Daniel Johnson and Cyreal.
                </a>
            </p>
            <p class="mt-1">
                Additionally used was, <a href="https://fonts.google.com/specimen/Dosis">Dosis, by Impallari Type.</a>
            </p>

            <p class="mt-8">
                Created using <a href="https://kit.svelte.dev/">SvelteKit,</a>
            </p>
            <p class="mt-1">
                and styled with <a href="https://tailwindcss.com/">TailwindCSS.</a>
            </p>
            <p class="mt-1">
                Built with <a href="https://pocketbase.io/">PocketBase.</a>
            </p>

            <p class="mt-8"><a href="https://izmichael.com">&copy; IzMichael 2024 - IzMichael</a></p>

            <Button variant="primary" on:click={() => goto('/')} class="mt-16">Return Home</Button>
        </div>
    </section>

    <section class="flex h-[25vh] w-full items-center justify-center lg:h-full lg:w-auto lg:flex-1">
        <img
            src="/assets/img/purple-microphone-unsplash.jpg"
            alt="Microphone on a Purple Background"
            class="h-full w-full object-cover"
        />
    </section>
</div>

<style>
    p {
        @apply w-full text-center font-bold;
    }

    a {
        /* eslint-disable-next-line svelte/valid-compile */
        @apply text-blue-600 hover:underline;
    }
</style>
