/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                },
                'pragati-bg': '#f8f1f9',
                'pragati-text': '#362023',
                'pragati-primary': '#466362',
                'pragati-secondary': '#bfd7b5',
                'pragati-accent': '#00abe7',
            },
            fontFamily: {
                ranade: ['Ranade', 'sans-serif'],
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
