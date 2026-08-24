/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      screens: { xs: '380px' },
      colors: {
        cu: {
          bg: '#F3F3F9',        // page background
          bar: '#4051A4',       // section header bar
          text: '#333333',      // primary body text
          accent: '#337AB7',    // card headings, table status links
          red: '#E10F0F',       // Submit / Cancel
          note: '#D9534F',      // warning / note text
          border: '#CCCCCC',    // input + select border
          table: '#DDDDDD',     // table cell border
          featured: '#21517B',  // highlighted card background
          green: '#05F964',     // highlighted card border
          dark: '#30465D',      // footer / neutral button
        },
        chip: {
          blue: '#E5F3FE',
          purple: '#F0E9F1',
          lavender: '#F2F3FF',
        },
        // Exact SweetAlert palette used by the real portal popup.
        sa: {
          heading: '#575757',
          body: '#797979',
          button: '#AEDEF4',
          icon: '#A5DC86',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        sa: ['"Open Sans"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 0 15px 4px rgba(100,98,92,0.06)',
        control: 'inset 0 1px 1px rgba(0,0,0,.075)',
      },
    },
  },
  plugins: [],
}
