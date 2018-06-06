/**
 * Created by Samba Bery KANE.
 */

// Gulp Configuration

// include gulp and plugins

var
    gulp = require('gulp'),
    newer = require('gulp-newer'),
    preprocess = require('gulp-preprocess'),
    htmlclean = require('gulp-htmlclean'),
    imagemin = require('gulp-imagemin'),
    pleeease = require('gulp-pleeease'),
    cssmin = require('gulp-cssmin'),
    size = require('gulp-size'),
    series = require('stream-series'),
    deporder = require('gulp-deporder'),
    stripdebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    browsersync = require('browser-sync'),
    del = require('del'),
    pkg = require('./package.json');

// files locations

var
    devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'),

    source = 'src/',
    dest = 'build/',

// HTML files
    html = {
        in: source + '**/*.html',
        watch: [source + '*.html', source + 'shared/**/*', source + 'views/**/*'],
        out: dest,
        context: {
            devBuild: devBuild
        }
    },

// CSS files
    css = {
        in: source + 'styles/**/*',
        out: dest + 'styles',
        filename: 'main.css'
    },

// JS files
    js = {
        in: source + 'scripts/**/*',
        out: dest + 'scripts/',
        filename: 'main.js'
    },

// Font files
    fonts = {
        in: source + 'fonts/**/*',
        out: dest + 'fonts/'
    },

// Images files
    images = {
        in: source + 'images/*.*',
        out: dest + 'images/'
    },

// Browsersync
    syncOpts = {
        server: {
            baseDir: dest,
            index: 'index.html'
        },
        open: false,
        notify: true
    };

// show build type
console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'development' : 'production') + ' build');

// Browser-sync
gulp.task('browsersync', function() {
    browsersync(syncOpts);
});

// Manage html
gulp.task('html', function () {
    var page = gulp.src(html.in).pipe(preprocess({ context: html.context }));
    if(!devBuild){
        page = page
            .pipe(size({ title: 'HTML in'}))
            .pipe(htmlclean())
            .pipe(size({ title: 'HTML out'}));
    }
    return page.pipe(gulp.dest(html.out))
});

// Manage JS
gulp.task('js', ['lang_files'], function() {
    if(devBuild) {
        return gulp.src(js.in)
            .pipe(newer(js.out))
            .pipe(gulp.dest(js.out));
    }
    else {
        /*var
            libsFolder = source + 'scripts/libs/',
            angularLibsFolder = libsFolder + 'angular/';
        return series(
            gulp.src(libsFolder + 'jquery.min.js'),
            gulp.src(libsFolder + 'bootstrap.min.js'),
            gulp.src(angularLibsFolder + 'angular.min.js'),
            gulp.src(angularLibsFolder + 'angular-route.min.js'),
            gulp.src(angularLibsFolder + 'angular-resource.min.js'),
            gulp.src(angularLibsFolder + 'angular-animate.min.js'),
            gulp.src(angularLibsFolder + 'ng-file-upload-all.min.js'),
            gulp.src(angularLibsFolder + 'jcs-auto-validate.min.js'),
            gulp.src(angularLibsFolder + 'angular-local-storage.min.js'),
            gulp.src(angularLibsFolder + 'ui-bootstrap-tpls.min.js'),
            gulp.src(angularLibsFolder + 'angular-spinkit.min.js'),
            gulp.src(angularLibsFolder + 'loading-bar.min.js'),
            gulp.src(source + 'scripts/app.js'),
            gulp.src(source + 'scripts/services/!*'),
            gulp.src(source + 'scripts/directives/!**!/!*'),
            gulp.src(source + 'scripts/controllers/!**!/!*'))
            .pipe(deporder())
            .pipe(concat(js.filename))
            .pipe(stripdebug())
            .pipe(uglify())
            .pipe(gulp.dest(js.out));*/
    }
});

// Manage CSS
gulp.task('css', function(){
    var cssFile = gulp.src(css.in);
    if(!devBuild){
        cssFile = cssFile
            .pipe(deporder())
            .pipe(concat(css.filename))
            .pipe(cssmin())
    }
    return cssFile.pipe(gulp.dest(css.out))
});

// Manage Fonts
gulp.task('fonts', function () {
    return gulp.src(fonts.in)
        .pipe(gulp.dest(fonts.out))
});

// Manage lang files
gulp.task('lang_files', function() {
    return gulp.src(source + 'scripts/libs/angular/lang/*')
        .pipe(gulp.dest(dest + 'scripts/lang/'));
});

// Clean the build folder
gulp.task('clean', function () {
    del([
        dest + '*'
    ]);
});

// Manage images
gulp.task('images',['favicon'], function () {
    return gulp.src(images.in)
        .pipe(newer(images.out))
        // .pipe(imagemin())
        .pipe(gulp.dest(images.out));
});

// manage favicon
gulp.task('favicon', function(){
    return gulp.src(source + 'favicon.ico')
        .pipe(newer(dest))
        .pipe(gulp.dest(dest));
});

// manage utils
gulp.task('utils', function(){
    return gulp.src(source + 'utils/*.*')
        .pipe(newer(dest + 'utils'))
        .pipe(gulp.dest(dest + 'utils'));
});

// Default task
gulp.task('default', ['html', 'css', 'js', 'fonts', 'lang_files','images', 'browsersync', 'utils'], function () {

    // HTML changes
    gulp.watch(html.watch, ['html', browsersync.reload]);

    // JS changes
    gulp.watch(js.in, ['js', browsersync.reload]);

    // CSS changes
    gulp.watch(css.in, ['css', browsersync.reload]);

    // Images changes
    gulp.watch(images.in, ['images', browsersync.reload]);

});
