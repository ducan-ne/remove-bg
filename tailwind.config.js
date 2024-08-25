
import { nextui } from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "src/**/*.{js,ts,jsx,tsx}",
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  important: '#remove-bg',
  plugins: [
    require('tailwindcss-react-aria-components'),
    nextui()
  ],
}

