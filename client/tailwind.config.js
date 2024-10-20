import withMT from "@material-tailwind/react/utils/withMT";
 
export default withMT({
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    screens:{
      'md': '768px',
      'lg': '1025px',
    },
    extend: {
      colors:{
        'primary':'#f3f0fa',
        'secondary':'#3a3092',
        'tertary': '#f54978',
        't1':'#7e7e7e'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
});
