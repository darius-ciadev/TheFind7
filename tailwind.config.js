/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                primary: "var(--color-primary)",
                background: "var(--color-background)",
                accent: "var(--color-accent)",
                neutral: "var(--color-neutral)",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            fontWeight: {
                normal: 400,
                semibold: 600,
                bold: 800,
            }
        }
    },
    plugins: []
}
