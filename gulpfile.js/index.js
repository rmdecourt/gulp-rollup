const path = require('path');
const fg = require('fast-glob');
const chalk = require('chalk');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const terser = require("rollup-plugin-terser");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require('@rollup/plugin-node-resolve');
const browserSync = require('browser-sync');
const livereload = require('livereload')
const greenBright = chalk.greenBright;
const red = chalk.red;
const log = console.log;

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
            terser.terser()
        ]
    },
    output: {
        format: 'umd',
        name: 'FIAP',            
        banner: banner(),
        sourcemap: 'inline',
        indent: false
    },
    watch: {
        exclude: 'node_modules/**'
    }
}

function watchBrowserSync(cb) {
    browserSync.init({ server: './dist' });
    watchJs().then(cb);
}

function watchLiveReload() {
    const server = livereload.createServer();
    server.watch(path.join(__dirname, '../dist/src'));
    watchJS().then(cb);
}

function banner() {
    return `document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');`;
}

async function getJSFiles() {
    const glob = await fg('./src/**/*.js');
    return glob;
}

async function build() {
    const files = await getJSFiles();
    await Promise.all(files.map(async(file) => {
        const input = Object.assign({ input: file }, rollupConfig.input);
        const output = Object.assign({ file: path.join('./dist', file) }, rollupConfig.output);    
        const bundle = await rollup.rollup(input);
        await bundle.write(output);
    }));
}

async function watchJS() {
    const files = await getJSFiles();

    const watchOptions = files.map((file) => {
        const input = Object.assign({ input: file }, rollupConfig.input);
        const output = Object.assign({ file: path.join('./dist', file) }, rollupConfig.output);
        const watch = rollupConfig.watch;
        return {...input,output, watch}
    })

    const watcher = await rollup.watch(watchOptions);
    let totalDuration = 0;

    watcher.on('event', (e) => {
        if(e.code === 'BUNDLE_END') {
            totalDuration += e.duration; 
        }
        if(e.code === 'END') {
            log(`${greenBright('All bundles completed...')}`)
            log(totalDuration);
            totalDuration = 0;
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

exports.build = build;
exports.watch = watchLiveReload;