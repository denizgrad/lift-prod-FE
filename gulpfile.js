"use strict";
/**
 * Gulp ve eklentileri
 * @gulp-babel: EcmaScript desteği ile javascript sıkıştırmak için
 * @gulp-sourcemaps: Sıkıştırılan dosyaların map dosyalarını oluşturmak için
 * @gulp-concat: Birden fazla dosyayı aynı dosyada birleştirmek için
 * @gulp-clean-css: CSS dosyalarının sıkıştırılması için
 */
const
    gulp = require('gulp'),
    clean = require('gulp-clean'),
    babel = require('gulp-babel'),
    sourcemaps  = require('gulp-sourcemaps'),
    concat  = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    htmlclean = require('gulp-htmlclean'),
    inject = require('gulp-inject');
/**
 * Sıkıştırılan JS ve CSS dosyaların kayıt edilecek konumları
 */
const
    saveJsDir = './dist/js',
    saveCssDir = './dist/css';

const paths = {
    src: 'src/**/*',
    srcImg: 'src/img/*',
    srcHTML: 'src/**/*.html',
    srcCSS: 'src/**/*.css',
    srcJS: 'src/**/*.js',

    dist: 'dist',
    distImg: 'dist/img/',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js'
};
/**
 *  Sıkıştırılacak dosyaların tanımlamaları
 *  gulpJobList listesi içinde tanımlı objeler gulp aracılığıya sıkıştırılır ve tek dosya olarak birleştirilir
 */
const
    gulpJobList = [],
    gulpTaskNameList = [];
// coreFiles objesini gulpJobList'e tanımlanıyor
gulpJobList.push(require('./gulp_files/coreFiles'));
gulpJobList.push(require('./gulp_files/bundleFiles'));


gulpJobList.map((job)=>{
    let id = UniqueId();
    if (job.css && job.css.taskName && job.css.outputName && job.css.fileList) {
        gulpTaskNameList.push(job.css.taskName);
        let splitted = job.css.outputName.split('.');
        splitted[0] = splitted[0] + id;
        register_css_task(job.css.taskName, job.css.fileList, splitted.join('.'));
    }
    if (job.js && job.js.taskName && job.js.outputName && job.js.fileList) {
        let splitted = job.css.outputName.split('.');
        splitted[0] = splitted[0] + id;
        gulpTaskNameList.push(job.js.taskName);
        register_script_task(job.js.taskName, job.js.fileList, splitted.join('.'), job.js.noPresets||false);
    }
});
gulp.task('html:clean', function () {
    return gulp.src(paths.distIndex, {read: false})
        .pipe(clean());
});
gulp.task('js:clean', function () {
    return gulp.src(paths.distJS+'*', {read: false})
        .pipe(clean());
});
gulp.task('css:clean', function () {
    return gulp.src(paths.distCSS+'*', {read: false})
        .pipe(clean());
});
gulp.task('clean', ['html:clean', 'js:clean', 'css:clean']);
// Gulp çalıştığı anda yapılan işlemler
gulp.task('default', gulpTaskNameList);
/**
 * Minify html templates
 */
gulp.task('html:dist', function () {
    return gulp.src(paths.srcHTML)
        .pipe(htmlclean())
        .pipe(gulp.dest(paths.dist));
});
/**
 * Copy Images to dist
 */
gulp.task('img:dist', function () {
    return gulp.src(paths.srcImg)
        .pipe(gulp.dest(paths.distImg));
});
/**
 * Minify and watch changes
 */
gulp.task('dev', function () {
    gulp.run('build');
    gulp.watch(paths.srcHTML, () => (gulp.run('inject:dist')));
    gulpJobList.map((job)=>{
        if (job.css && gulpTaskNameList.indexOf(job.css.taskName) !== -1 ) {
            gulp.watch(job.css.fileList,() => {gulp.run(job.css.taskName)});
        }
        if (job.js && gulpTaskNameList.indexOf(job.js.taskName) !== -1 ) {
            gulp.watch(job.js.fileList,() => {gulp.run(job.js.taskName)});
        }
    });
});
gulp.task('inject:dist', ['html:dist'], function () {
    const css = gulp.src(paths.distCSS);
    const js = gulp.src(paths.distJS);
    const gulpJobs = gulp.src(paths.distIndex);
    return gulpJobs
        .pipe(inject( css, { relative:true } ))
        .pipe(inject( js, { relative:true } ))
        .pipe(gulp.dest(paths.dist));
});
gulp.task('build', ['inject:dist', 'img:dist', 'default'], function () {
    const css = gulp.src(paths.distCSS);
    const js = gulp.src(paths.distJS);
    const gulpJobs = gulp.src(paths.distIndex);
    return gulpJobs
        .pipe(inject( css, { relative:true } ))
        .pipe(inject( js, { relative:true } ))
        .pipe(gulp.dest(paths.dist));
});
/**
 * Yeni bir gulp script taski oluşturur
 * @param {string} taskName: Gulp task name
 * @param {Array} jsFiles: Src files
 * @param {string} outputName: Dist output file name
 * @param {boolean} noPresets: Disable babel presets if its true
 */
function register_script_task(taskName, jsFiles, outputName, noPresets=false){
    // JS dosyalarını sıkıştırır
    // ve hepsini birleştirerek @saveJsDir klasörüne kaydeder.
    const preSets = noPresets ? ['minify'] : ['es2017','stage-2','minify'];
    gulp.task(taskName, function () {
        return gulp.src(jsFiles)
            .pipe(sourcemaps.init())
            .pipe(concat(outputName))
            .pipe(babel({presets: preSets}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(saveJsDir));
        });
}
/**
 * Yeni bir gulp css taski oluşturur
 * @param taskName: string
 * @param cssFiles: list
 * @param outputName: string
 */
function register_css_task(taskName, cssFiles, outputName){
    // CSS dosyalarını işler, browser uyumluluğu sağlar,
    // ve oluşturulan CSS dosyasını @saveCssDir klasörüne kaydeder.
    gulp.task(taskName, function () {
        return gulp.src(cssFiles)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers: ['last 2 versions', '> 5%'],
                cascade: false
            }))
            .pipe(concat(outputName))
            .pipe(cleanCSS())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(saveCssDir));
    });
}

function UniqueId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}


