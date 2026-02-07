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
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			// Brand colors - използвайте brand и brand-dark
  			brand: {
  				DEFAULT: 'hsl(var(--brand))',
  				dark: 'hsl(var(--brand-dark))',
  			},
  			// Navy colors - използвайте navy и navy-dark
  			navy: {
  				DEFAULT: 'hsl(var(--navy))',
  				dark: 'hsl(var(--navy-dark))',
  			},
  			// Tag colors
  			tag: {
  				new: 'hsl(var(--tag-new))',
  				limited: 'hsl(var(--tag-limited))',
  				text: 'hsl(var(--tag-text))',
  			},
  			// Footer colors
  			footer: {
  				bg: 'hsl(var(--bg-footer))',
  			},
  			// Gray utilities - за по-лесна употреба
  			'gray-custom': {
  				400: 'hsl(var(--gray-400))',
  				800: 'hsl(var(--gray-800))',
  				333: 'hsl(var(--gray-333))',
  			},
  			// Gradient colors
  			'gradient-pink': 'hsl(var(--gradient-pink))' /* #f2979c */
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
