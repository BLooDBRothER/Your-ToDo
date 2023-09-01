import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#141414",
        secondary: "#222225",
        light: "#DDD",
        accent: "#901ed6"
      },
      borderColor: {
        light: "#444"
      }
    },
  },
  plugins: [],
}
export default config
