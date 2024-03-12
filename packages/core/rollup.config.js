import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    // file: 'dist/index.js',
    format: 'es',
    dir: 'dist',
    preserveModules: true,
    preserveModulesRoot: 'src'
  },
  plugins: [
    typescript({
      noEmitOnError: true,
    }),
    json(),
  ],
};
