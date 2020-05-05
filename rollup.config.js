const typescript = require('rollup-plugin-typescript2');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const pkg = require('./package.json');
const shim = require('rollup-plugin-shim');
const { terser } = require('rollup-plugin-terser');
const generatePackageJson  = require('rollup-plugin-generate-package-json');

const typescriptPlugin = () => typescript({
    typescript: require('typescript'),
    tsconfigOverride: { compilerOptions: { module: 'es2015' } },
});

const generateBrowserBundle = (minify) => ({
    input: 'src/browser.ts',
    output: [
        {
            file: `browser/index.es${minify ? '.min' : ''}.js`,
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
                module: "index.es.js",
                type: 'browser.d.ts',
            }
        }),
        // These dependencies are optionnal, mock them.
        shim({
            events: 'export function EventEmitter() {}',
        }),
        json(),
        typescriptPlugin(),
        commonjs({
            namedExports: {
                'domutils': ['getAttributeValue', 'getInnerHTML', 'getOuterHTML', 'getText'],
                'css-select': ['selectAll'],
            }
        }),
        resolve({ browser: true }),
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
    plugins: [typescriptPlugin()],
});

export default [
    generateBrowserBundle(true),
    generateBrowserBundle(false),
    generateNodeJsBundle(),
]