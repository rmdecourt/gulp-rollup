const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const fg = require('fast-glob');
const path = require('path');
const terser = require("rollup-plugin-terser");
const commonjs = require("rollup-plugin-commonjs");
const resolve = require('@rollup/plugin-node-resolve');
const chalk = require('chalk');
const log = console.log;
const gulp = require('gulp');

let cacheArray = []; // implement separated cache.

const rollupConfig = {
    input: {
        treeshake: true,
        plugins: [
            babel({
                presets: ["@babel/preset-env"],
                exclude: 'node_modules/**'
            }),
            resolve(),
            commonjs(),
            //terser.terser()
        ]
    },
    output: {
        format: 'umd',
        name: 'FIAP',            
        banner: banner(),
        //sourcemap: 'inline'
    },
    watch: {
        exclude: 'node_modules/**'
    }
}

function banner() {
    return `document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');`;
}

async function getJSFiles() {
    const glob = await fg('./src/**/*.js');
    return glob;
}

async function build(cb) {
    const files = await getJSFiles();
    await Promise.all(files.map(async(file) => {
        const input = Object.assign({ cache: buildCache, input: file }, rollupConfig.input);
        const output = Object.assign({ file: path.join('./dist', file) }, rollupConfig.output);    
        const bundle = await rollup.rollup(input);
        buildCache = bundle.cache;
        return await bundle.write(output);
    }));
    cb();
}

async function watch(cb) {
    const cyan = chalk.cyan;
    const greenBright = chalk.greenBright;
    const red = chalk.red;
    
    const files = await getJSFiles();
    const watchOptions = files.map((file) => {
        const input = Object.assign({ cache: buildCache, input: file }, rollupConfig.input);
        const output = Object.assign({ file: path.join('./dist', file) }, rollupConfig.output);
        const watch = rollupConfig.watch;
        return {...input,output, watch}
    })

    const watcher = await rollup.watch(watchOptions);
    buildCache = watcher.cache;

    log(`${greenBright('Starting bundles...')}`);

    watcher.on('event', (e) => {
        if(e.code === 'BUNDLE_END') {
            log(`${cyan('Bundle completed:')}${e.input}`);
        }
        if(e.code === 'END') {
            log(`${greenBright('All bundles completed...')}`)
        }
        if(e.code === 'ERROR') {
            log(`${red('ERROR: ')}${e.error}`)
        }
    });

    return new Promise(resolve => {
        process.on('SIGINT', ()=> {
            watcher.close();
            resolve();
        });
    });
}


// async function watch() {
//     gulp.watch('./src/**/*.js', (a) => {
//         log('hello world', a);
//     });
// }

exports.build = build;
exports.watch = watch;