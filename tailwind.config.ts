import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        btncolor: "#004080",
        gray: {
          custom: "#F1F1F1",
        },
      },
      backgroundColor: {
        togglebg: "#FDFDFD",
      },
      maxWidth: {
        "3/5": "60%",
      },
      placeholderColor: (theme: any) => ({
        black: theme("color.black"),
      }),
      shadows: {
        shadowbox: " 2px 2px 15px 0px #00000026",
      },
      animation: {
        "fade-in-out": "fadeInOut 1s infinite",
      },
      keyframes: {
        fadeInOut: {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
      },
      borderWidth: {
        custom: "0.3px 0px 0.3px 0px", // Custom border-width
      },
      screens: {
           'xss': '400px', // Add custom breakpoint
           'xs': '500px', // Add custom breakpoint
           'sm': '640px',
           'md': '768px',
           'lg': '1024px',
           'xl': '1280px',
           '2xl': '1536px',
         },
    },
  },

  plugins: [
    function ({ addUtilities }: any) {
      addUtilities({
        ".animation-delay-200": {
          "animation-delay": "200ms",
        },
        ".animation-delay-400": {
          "animation-delay": "400ms",
        },
      });
    },
  ],
};
export default config;
