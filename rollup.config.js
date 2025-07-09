import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const config = [
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        target: 'ES2020',
        module: 'ESNext'
      })
    ]
  },
  // UMD build for browser
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'CryptoKittyGenerator',
      sourcemap: true
    },
    plugins: [
      nodeResolve({ browser: true }),
      commonjs(),
      typescript({
        declaration: false,
        declarationMap: false,
        target: 'ES2020',
        module: 'ESNext'
      })
    ]
  }
];

export default config;
