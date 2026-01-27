import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			// Shadcn/ui colors (used in forms and UI components)
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			// Brand colors
  			brand: {
  				DEFAULT: '#7d0d23',
  				dark: '#5a0919',
  			},
  			navy: {
  				DEFAULT: '#1f4769',
  				dark: '#163550',
  			},
  			tag: {
  				new: '#C9A9A6',
  				limited: '#D4AF8E',
  				text: '#1F2933',
  			},
  			footer: {
  				bg: '#FAF8F6',
  			}
  		},
		  borderRadius: {
			sm: 'var(--radius)',  
			md: 'calc(var(--radius) + 4px)',  
			lg: 'calc(var(--radius) + 8px)',  
		  },
  	}
  },
  plugins: [tailwindcssAnimate],
} satisfies Config; 
