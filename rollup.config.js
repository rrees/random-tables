import * as fs from 'fs';
import svelte from 'rollup-plugin-svelte';

export default {
  entry: 'src/app.js',
  format: 'iife',
  dest: 'js/app.js',
  plugins: [
  	svelte({
  	})
  ]
};