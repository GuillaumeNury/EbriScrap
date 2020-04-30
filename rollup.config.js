const typescript = require('rollup-plugin-typescript2');
const pkg = require('./package.json');

export default {
    input: 'src/index.ts',
    output: [{
            file: pkg.main,
            format: 'cjs',
        },
        {
            file: pkg.module,
            format: 'es',
        },
    ],
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
            tsconfigOverride: { compilerOptions: { module: 'es2015' } },
        }),
    ],
}