let {cssDir, jsDir} = require('./_paths');

const
    cssFiles = [
        cssDir + '*.css',
        cssDir + 'helpers/*.css',
    ],

    jsFiles = [
        jsDir + 'services/**/*.js',
        jsDir + 'config/**/*.js',
        jsDir + 'components/**/*.js',
        jsDir + 'controllers/**/*.js',
        jsDir + 'directives/**/*.js',
        jsDir + 'dialogs/**/*.js',
        jsDir + 'app.js',
        jsDir + 'appRun.js'
    ],
    bundleMap = {
        css: {fileList: cssFiles, taskName: 'bundle-css:dist', outputName: 'bundle.min.css'},
        js: {fileList: jsFiles, taskName: 'bundle-js:dist', outputName: 'bundle.min.js'}
    };

module.exports = bundleMap;


