import plugin from "tailwindcss/plugin";
import { type Config } from "tailwindcss";
import { fontFamily } from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

export default {
  mode: "jit",
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      red: colors.red,
      pink: colors.pink,
      gray: colors.gray,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      purple: colors.purple,
      'MintGreen': '#D0FEF5',
      'DarkPeriwinkle': '#AEADF0',
      'Grape': '#642CA9',
      'DarkPurple': '#210124',
      'Claret': '#750D37',
      'ChocolateCosmos': '#49111C',
    },
    extend: {
      height: {
        'GalleryItem': '668px'
      },
      width: {
        "GalleryItem": "384px",
        "90": "350px"
      },
      maxWidth: {
        '10xl': '1480px',
      },
      fontFamily: {
        CocoBiker: ['CocoBiker', ...fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        ".my-rotate-y-180": {
          transform: "rotateY(180deg)"
        },
        ".my-rotate-y": {
          transform: "perspective(600px) rotateY(354deg)"
        },
        ".preserve-3d": {
          transformStyle: "preserve-3d",
        },
        ".perspective": {
          perspective: "1000px"
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        }
      })
    })
  ],
} as Config;