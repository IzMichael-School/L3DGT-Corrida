/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            height: {
                screen: '100dvh',
            },
            colors: {
                brand: {
                    DEFAULT: '#654597',
                    black: '#2a2b2e',
                    green: '#297b4e',
                    purple: '#654597',
                    red: '#da2c43',
                    white: '#f9f8f8',
                },
            },
        },
        fontFamily: {
            sans: ['Jura', 'Dosis', 'sans-serif'],
            mono: ['Sono', 'monospace'],

            jura: ['Jura', 'sans-serif'],
            dosis: ['Dosis', 'sans-serif'],
            sono: ['Sono', 'monospace'],
        },
    },
    plugins: [],
};
