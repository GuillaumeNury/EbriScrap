const fs = require('fs');
const path = require('path');

/**
 * CONFIGURATION
 */

const testCases = [
    './cases/centrale',
    './cases/github',
    './cases/leboncoin',
    './cases/reezocar',
    './cases/wikipedia',
];

const versions = [
    { name: 'current', script: require('../dist/index') },
    {
        name: '3.2.1',
        script: require('./versions/3.2.1/node_modules/ebri-scrap/dist/index'),
        skip: ['./cases/reezocar']
    },
];

/**
 * END OF CONFIGURATION
 */

const getPaths = testCase => ({
    input: path.join(__dirname, testCase, 'input.html'),
    expected: path.join(__dirname, testCase, 'expected.json'),
    config: path.join(__dirname, testCase, 'config.json'),
});

const getFile = path => fs.existsSync(path) ? fs.readFileSync(path).toString() : null;

const getTestAssets = testCase => {
    const { input, expected, config } = getPaths(testCase);
    const expectedFile = getFile(expected);

    return {
        input: getFile(input),
        expected: expectedFile,
        config: JSON.parse(getFile(config)),
        generateSnapsot: !expectedFile,
        expectedPath: expected,
    }
}

// Initialize benchmark
const benchmark = versions.reduce((acc, v) => ({ ...acc, [v.name]: 0 }), {});

for (const testCase of testCases) {
    console.log(`Testing ${testCase}...`);

    for (const version of versions) {
        process.stdout.write(`\tVersion ${version.name}`);

        const { input, expected, expectedPath, config, generateSnapsot } = getTestAssets(testCase);

        const from = new Date();
        const parsed = version.script.parse(input, config);
        const elapsed = new Date() - from;
        benchmark[version.name] += elapsed
        
        const output = JSON.stringify(parsed, undefined, '  ');
        
        if (version.skip && version.skip.includes(testCase)) {
            process.stdout.write(`\t\tSKIP\t\t${elapsed}ms\n`);
            continue;
        }
        if (generateSnapsot) {
            fs.writeFileSync(expectedPath, output);
        }
        if (!generateSnapsot && expected !== output) {
            console.log(`\nInvalid output:`);
            console.log();
            console.log(output);
            console.log();
        } else {
            process.stdout.write(`\t\tPASS\t\t${elapsed}ms\n`);
        }
    }
}

const sortedVersions = versions.sort((v1, v2) => benchmark[v1.name] - benchmark[v2.name]);
const bestScore = benchmark[sortedVersions[0].name];

console.log(`\n\t======== Benchmark ========`);

for (const version of sortedVersions) {
    const score = benchmark[version.name];
    const percent = (score - bestScore) / score;
    console.log(`${version.name}\t\t ${score}ms\t\t${percent ? (percent * 100).toFixed(1) + '%' : ''}`);
}