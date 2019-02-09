let {nodeDir} = require('./_paths');

const
    coreCssFiles = [
        nodeDir + 'angular-material/angular-material.css',
        nodeDir + 'angular-material-data-table/dist/md-data-table.css',
        nodeDir + 'animate.css/animate.css',
        nodeDir + 'angular-toastr/dist/angular-toastr.css',
    ],
    coreJsFiles = [
        nodeDir + 'angular/angular.js',
        nodeDir + 'angular-sanitize/angular-sanitize.js',
        nodeDir + 'angular-material/angular-material.js',
        nodeDir + 'angular-aria/angular-aria.js',
        nodeDir + 'angular-messages/angular-messages.js',
        nodeDir + 'angular-animate/angular-animate.js',
        nodeDir + '@uirouter/angularjs/release/angular-ui-router.js',
        nodeDir + '@uirouter/angularjs/release/stateEvents.js',
        nodeDir + 'angular-material-data-table/dist/md-data-table.js',
        nodeDir + 'angular-toastr/dist/angular-toastr.tpls.js',
        nodeDir + 'angular-ui-mask/dist/mask.js',
        nodeDir + 'angular-base64/angular-base64.js',
        nodeDir + 'ngstorage/ngStorage.js',
        nodeDir + 'moment/moment.js',
        nodeDir + 'moment/locale/tr.js',
    ],
    coreGulpMap = {
        css: {fileList: coreCssFiles, taskName: 'app-core-css:dist', outputName: 'app-core.min.css'},
        js: {fileList: coreJsFiles, taskName: 'app-core-js:dist', outputName: 'app-core.min.js', noPresets: true}
    };

module.exports = coreGulpMap;



