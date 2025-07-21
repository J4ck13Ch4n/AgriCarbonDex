/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary backgrounds theo Trade.jsx
        'primary-dark': '#111214',
        'secondary-dark': '#1a1b1e',
        'card-dark': '#232426',
        'border-dark': '#333',
        'border-light': '#555',

        // Accent colors
        'accent-green': '#00ffae',
        'accent-red': '#ef4444',
        'accent-yellow': '#ffe066',

        // Text colors
        'text-primary': '#fff',
        'text-secondary': '#aaa',
        'text-muted': '#666',
      },
      fontFamily: {
        'primary': ['Inter', 'Roboto Mono', 'Menlo', 'monospace', 'Arial', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 2px 8px #0002',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.4)',
        'green': '0 2px 8px rgba(0, 255, 174, 0.3)',
        'green-hover': '0 4px 12px rgba(0, 255, 174, 0.4)',
        'red': '0 2px 8px rgba(220, 38, 38, 0.3)',
        'red-hover': '0 4px 12px rgba(220, 38, 38, 0.4)',
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
        'card-xl': '20px',
      }
    },
  },
  plugins: [],
};
=======
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

>>>>>>> 35b40b15d7087da67e4b04d1a99d95a2efdcbd96
