var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var streamify = require('gulp-streamify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
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

    browserify('./client/js/index.js').bundle({debug: true})
        .pipe(source('bundle.js'))
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

    browserify('./client/js/index.js').bundle()
        .pipe(source('bundle.min.js'))
        .pipe(streamify(uglify({
            compress: {
                unsafe: true
            }
        })))
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