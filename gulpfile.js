var gulp = require('gulp');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var rename = require("gulp-rename");
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var uncss = require('gulp-uncss');
var fs = require('fs');

gulp.task('default', function () {

});

gulp.task('clean', function (cb) {
    gulp.src('build/*', {read: false}).pipe(clean());
    cb();
});

gulp.task('dev', ['clean'], function () {

    gulp.src('client/js/index.js')
        .pipe(browserify({debug: true}))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('build'));

    gulp.src('client/css/*.css')
        .pipe(gulp.dest('build'));

    gulp.src('client/index.html')
        .pipe(htmlreplace({
            css: ['normalize.css', 'main.css'],
            js: 'bundle.js'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('prod', ['clean'], function () {

    gulp.src('client/js/index.js')
        .pipe(browserify({debug: false}))
        .pipe(uglify({
            compress: {
                unsafe: true
            }
        }))
        .pipe(rename('bundle.min.js'))
        .pipe(gulp.dest('build'));

    gulp.src(['client/css/normalize.css', 'client/css/main.css'])
        .pipe(concat('style.min.css'))
        .pipe(uncss({
            html: ['client/index.html'],
            ignore: ['.in', '.out']
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('build'));

    gulp.src('client/index.html')
        .pipe(htmlreplace({
            css: 'style.min.css',
            js: 'bundle.min.js',
            analytics: {
                files: fs.readFileSync(__dirname + '/client/inc/analytics'),
                tpl: '%s'
            },
            adsense: {
                files: fs.readFileSync(__dirname + '/client/inc/adsense'),
                tpl: '%s'
            }
        }))
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true
        }))
        .pipe(gulp.dest('build'));
});