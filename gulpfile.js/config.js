const path = require('path');

const config = {
    paths: {
        root: path.join(__dirname, '../'),
        src: path.join(this.root, 'src'),
        dist: path.join(this.root, 'dist')
    }
}

module.exports = config;