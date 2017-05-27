import * as fs from 'fs';
import svelte from 'rollup-plugin-svelte';

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/app.js',
  format: 'iife',
  dest: 'js/app.js',
  plugins: [
  	commonjs({
  		include: 'node_modules/**'
  	}),
  	resolve(),
  	  	svelte({
  	}),
  ],
  globals: {
  	"ryuutama-town-generator": 'townGenerator'
  }
};