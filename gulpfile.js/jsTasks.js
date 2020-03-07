const gulp = require('gulp');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const fg = require('fast-glob');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const path = require('path');
const livereload = require('livereload');

/**
 * Fetch javascript entries for bundling.
 * 
 * @return 
 */
async function buildOptions() {
    const config = [];
    const glob = await fg('./src/**/*.js');
    glob.forEach((file) => {
        config.push({
            input: [file, 'lodash'],
            output: {
                file: 'dist/' + file,
                format: 'cjs'
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

async function build(cb) {
    const files = await buildOptions();
    files.forEach(async(data) => {
        const input = {input: data.input};
        const output = {output: data.output};
        const bundle = await rollup.rollup(input);
        //bundle.generate(output);
        await bundle.write(output);
    });
    cb();
}

async function watchJs() {
    const files = await buildOptions();
    const watcher = await rollup.watch(files);
    watcher.on('event', async(e) => {
        if(e.code === 'END') {
            console.log('ended');
            reload();
        }
    });
}

// function watch() {
    //     browserSync.init({
        //         server: "./dist"
        //     });
        //     watchJs();
        // }
        
        // function watch() {
        //     livereload.listen({
            //         port:8080,
            //         host:'localhost',
            //         basePath: path.join(__dirname, '../dist/src')
            //     });
            //     watchJs();c
            // }
            
function watch() {
    console.log(process.env.NODE_ENV);
    // const server = livereload.createServer();
    // server.watch(path.join(__dirname, '../dist/src'), function(a) {
    //     console.log(a);
    // });
    // watchJs();
}

exports.build = build;
exports.watch = watch;