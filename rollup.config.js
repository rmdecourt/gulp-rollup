const fg = require('fast-glob');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');

async function getFiles() {
    const config = [];
    const glob = await fg('./src/**/*.js');
    glob.forEach((file) => {
        config.push({
            input: file,
            output: {
                file: 'dist/' + file,
                format: 'cjs',
                compact: true,
                sourcemap: 'inline'
            },
            plugins: [
                babel({
                    exclude: 'node_modules/**'
                })
            ]
        })
    });
    return config;    
}

async function build() {
    const files = await getFiles();
    files.forEach(async(data) => {
        const bundle = await rollup.watch(data);
        //bundle.generate(output);
        //bundle.write(output);
    });   
}

build();