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

                // const server = livereload.createServer();
    // server.watch(path.join(__dirname, '../dist/src'), function(a) {
    //     console.log(a);
    // });
    // watchJs();


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
        
function watch(cb) {
    console.log();
    cb()
}


exports.watch = watch;

function generateDateTimeComment() {
    const now = new Date();
    return `/**\n* BUNDLE INFO.\n* Bundle generated at: ${now.toString()}\n*/`;
}

function generateLiveReloadScript() {
    return `document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>');`;
}

function prependScript() {
    return [
        generateDateTimeComment(), 
        generateLiveReloadScript()
    ].join('\n');
}

,
                banner: prependScript()










                async function watch() {
                    const files = await getJSFiles();
                    const watcher = await rollup.watch(files);
                    watcher.on('event', (e) => {
                        if(e.code === 'END') {
                            console.log('ended');
                            reload();
                        }
                    })
                }