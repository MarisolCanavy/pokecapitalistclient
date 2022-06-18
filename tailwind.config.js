module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,jpg}",
  ],
  theme: {
    colors: {
      'blue': '#1fb6ff',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
      'light-gray': '#F8F8F8',
      'light-light-gray': '#AAABAC',
      'medium-gray': '#C8D0D0',
      'dark-gray': '#607078',
      'white': '#FFFFFF',
      'black': '#24282B',
      'background': '#24282B',
      'color-font': '#494949',
    },
    fontFamily: {
      sans: ['SCR-ITenRegW00-Regular', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
      poke: ['SCR-ITenRegW00-Regular', 'sans-serif'],
    },
    maxWidth: {
      'xxxs': '35%',
    },
    extend: {
      backgroundImage: {
        'bg': "url('./images/fondecran.png')",
        'fondPoke': "url('./images/fond2.png')"
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      width: {
        '471': '29.5rem',
      }
    }
  },
  plugins: [],
}
