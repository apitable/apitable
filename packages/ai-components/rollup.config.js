import * as path from 'path';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss';

export default {
  input: 'src/index.ts',
  output: {
    // file: 'dist/index.esm.js',
    format: 'es',
    dir: 'dist',
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
  plugins: [
    commonjs(),
    typescript({
      noEmitOnError: false,
    }),
    json(),
    image(),
    postcss({
      // extract: false,
      extensions: ['.css', '.less'],
      plugins: [tailwindcss],
      modules: {
        localsConvention: 'camelCase',
      },
    }),
    alias({
      entries: [{ find: 'static', replacement: path.resolve(path.resolve(__dirname), 'src/static') }],
    }),
  ],
  external: ['tslib']
};
