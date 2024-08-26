/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      height: {
        '128': '32rem', // Example custom height
        '144': '36rem',
        'half-screen': '50vh', // Custom height using viewport height
        'full-screen': '100vh',
        '10%': '10vh',
        '90%': '90vh'
      },
      margin: {
        '100': '500px',
        '110': '610px'
      },
      height: {
        '200': '600px',
        '90%': '94vh'
      },
      inset: {
        '20vw': '20vw'
      }
    },
  },
  plugins: [],
};
