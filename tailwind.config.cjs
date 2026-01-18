/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                midnight: "#0f172b",
                indigoMid: "#1c398e",
                slateDeep: "#1d293d",
            },
            fontFamily: {
                brand: ["\"Cinzel\"", "serif"],
                body: ["\"Source Sans 3\"", "sans-serif"],
            },
        },
    },
    plugins: [],
};
