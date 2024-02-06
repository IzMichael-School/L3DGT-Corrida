/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            height: {
                screen: '100dvh'
            },
        },
        fontFamily: {
            sans: ['Lexend', 'Rubik', 'sans-serif'],
            mono: ['Spline Sans Mono', 'monospace'],

            lexend: ['Lexend'],
            splinesans: ['Spline Sans Mono'],
            rubik: ['Rubik'],
        },
    },
    plugins: [],
}
