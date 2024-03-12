import fs from 'fs';
import path from 'path';

const CSS_FILE_PATH = path.resolve(__dirname, '../src/pc/styles/lib_colors.css');

function generateThemeObjectFromCSSFile() {
  const cssContent = fs.readFileSync(CSS_FILE_PATH, 'utf-8');
  const themeStartIndex = cssContent.indexOf(':root[data-theme="light"]');
  const themeEndIndex = cssContent.indexOf('}', themeStartIndex);
  const themeContent = cssContent.slice(themeStartIndex, themeEndIndex);

  const themeObject: { [key: string]: string } = {};
  const themeItems = themeContent.match(/--\w+:\s[^;]+;/g);

  if (themeItems) {
    themeItems.forEach((item) => {
      const [key, value] = item.split(':');
      const formattedKey = key.replace('--', '').trim();
      themeObject[formattedKey] = `var(${key.trim()})`;
    });
  }

  return themeObject;
}

const themeObject = generateThemeObjectFromCSSFile();
const CONFIG_PATH = path.resolve(__dirname, '..', 'tailwind.config.js');

function addColorsToTailwindConfig(newColors) {
  const config = require(CONFIG_PATH);

  console.log('config', config);

  const colors = {
    ...config.theme.extend.colors,
    ...newColors,
  };

  const newConfigContent = `/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'vk-',
  darkMode: ['data-theme'],
  content: ['./pages/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 2)}
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require('@tailwindcss/typography')],
};
   `;

  fs.writeFileSync(CONFIG_PATH, newConfigContent, 'utf8');
}

addColorsToTailwindConfig(themeObject);
