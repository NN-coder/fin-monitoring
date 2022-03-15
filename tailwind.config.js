module.exports = {
  mode: 'jit',
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  plugins: [require('@tailwindcss/line-clamp')],
  theme: {
    extend: {
      backgroundImage: {
        dropdown: "url('/dropdown.svg')",
      },
    },
  },
};
