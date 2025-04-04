/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        cirtGrey: "#363434",
        cirtRed: "#C8102E",
        testingColorBlack: "#09090B",
        testingColorGrey: "#27272A",
        testingColorWhite: "#FAFAFA",
        testingColorHover: "#E3E3E4",
        testingColorOutline: "#27272A",
        testingColorSubtitle: "#A1A1AA",
        testingColorHover: "#18181A",
        testingColorSidebar: "#F4F4F5"
      },
    },
  },
  plugins: [],
};
