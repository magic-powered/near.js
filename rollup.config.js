import rollupJson from 'rollup-plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import polyfills from 'rollup-plugin-polyfill-node';
import tsproject from './tsconfig.project.json';

const extensions = ['.ts'];
const workspaces = tsproject.references;

export default workspaces.map(({ path }) => ({
  input: `${path}/index.ts`,
  output: [
    {
      format: 'esm',
      sourcemap: true,
      dir: `${path}/dist`,
      entryFileNames: '[name].[format].js',
    },
    {
      format: 'umd',
      sourcemap: true,
      dir: `${path}/dist`,
      name: path.split('/').pop(),
      entryFileNames: '[name].[format].js',
      globals: { axios: 'axios' },
    },
    {
      format: 'cjs',
      sourcemap: true,
      dir: `${path}/dist`,
      entryFileNames: '[name].[format].js',
    },
  ],
  treeshake: true,
  preserveSymlinks: true,
  external: ['axios'],
  plugins: [
    polyfills({
      include: [
        'url',
        'http',
        'https',
        'stream',
        'assert',
        'tty',
        'util',
        'os',
        'zlib',
        'events',
      ],
    }),
    resolve({
      extensions,
      browser: true,
      preferBuiltins: false,
    }),
    rollupJson(),
    typescript({
      outputToFilesystem: true,
      tsconfig: `${path}/tsconfig.json`,
    }),
    commonjs({ include: /node_modules/ }),
    babel({
      extensions,
      babelHelpers: 'bundled',
      exclude: /node_modules/,
    }),
  ],
}));
