/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: {
        // Narrow-phone tweak point (360px devices fall below this).
        xs: '380px',
      },
      colors: {
        cu: {
          blue: '#4658A0',
          dark: '#30465D',
          bg: '#F3F3F8',
          border: '#D5D5D5',
          red: '#E10600',
          text: '#222222',
          remarks: '#0000CC',
          success: '#9AD47A',
        },
        // Exact SweetAlert palette used by the real portal popup.
        sa: {
          overlay: 'rgba(0,0,0,0.4)',
          heading: '#575757',
          body: '#797979',
          button: '#AEDEF4',
          buttonHover: '#a1d9f2',
          icon: '#A5DC86',
          iconRing: 'rgba(165,220,134,0.2)',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'Helvetica', 'sans-serif'],
        sa: ['"Open Sans"', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
