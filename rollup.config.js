const typescript = require('@rollup/plugin-typescript');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const pkg = require('./package.json');
const shim = require('rollup-plugin-shim');
const { terser } = require('rollup-plugin-terser');
const generatePackageJson  = require('rollup-plugin-generate-package-json');

const generateBrowserBundle = (minify) => ({
		input: 'src/browser.ts',
		output: [
				{
						file: `browser/index${minify ? '.min' : ''}.mjs`,
						format: 'esm',
				},
				{
						file: `browser/index${minify ? '.min' : ''}.js`,
						format: 'iife',
						name: 'ebriscrap'
				},
		],
		plugins: [
				generatePackageJson({
						outputFolder: 'browser',
						baseContents: {
								name: `${pkg.name}/browser`,
								private: true,
								main: "index.js",
								module: "index.mjs",
								type: 'BROWSER.d.ts',
						}
				}),
				// These dependencies are optionnal, mock them.
				shim({
						events: 'export function EventEmitter() {}',
				}),
				json(),
				typescript(),
				commonjs(),
				nodeResolve({ browser: true }),
				...(minify ? [terser()] : []),
		],
});

const generateNodeJsBundle = () => ({
		input: 'src/index.ts',
		output: [
				{ file: pkg.main, format: 'cjs' },
				{ file: pkg.module, format: 'es' },
		],
		external: [
				...Object.keys(pkg.dependencies || {}),
				...Object.keys(pkg.peerDependencies || {}),
		],
		plugins: [typescript()],
});

export default [
		generateBrowserBundle(true),
		generateBrowserBundle(false),
		generateNodeJsBundle(),
]