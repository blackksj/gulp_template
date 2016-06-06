var gulp = require('gulp');
var mainBowerFiles = require('gulp-main-bower-files');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var filter = require('gulp-filter');
var clean = require('gulp-clean');
var less = require('gulp-less');
var concatcss = require('gulp-concat-css');
var uglifycss = require('gulp-uglifycss');
var webserver = require('gulp-webserver');

gulp.task('default', ['clean', 'vendor', 'scripts', 'styles', 'html'], function() {
    // place code for your default task here
});

gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/less/*.less', ['styles']);
    gulp.watch('src/html/*.html', ['html']);
});

gulp.task('vendor', function() {
    var jsFilter = filter('**/*.js', { restore: true });
    var cssFilter = filter('**/*.css', { restore: true });
    var fontFilter = filter('**/fonts/*', { restore: true });

    var mainBower = mainBowerFiles({
        overrides: {
            bootstrap: {
                main: [
                    './dist/css/*.min.css',
                    './dist/fonts/*.*'
                ]
            }
        }
    });

    return gulp.src('bower.json')
        .pipe(mainBower)
        .pipe(jsFilter)
        .pipe(concat('vendor.min.js'))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(cssFilter.restore)
        .pipe(fontFilter)
        .pipe(rename({dirname: ''}))
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(concat('script.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', function() {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(concatcss('style.css'))
        .pipe(gulp.dest('dist/css'))
        .pipe(uglifycss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('html', function() {
    return gulp.src('src/html/**/*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('webserver', ['watch'],  function() {
    gulp.src('dist')
        .pipe(webserver({
            livereload: true,
            fallback: 'index.html',
            open: true
        }));
});

gulp.task('clean', function() {
    return gulp.src(['dist/**/*.js', 'dist/**/*.css', 'dist/**/*.eot', 'dist/**/*.svg', 'dist/**/*.ttf', 'dist/**/*.woff', 'dist/**/*.woff2'])
        .pipe(clean());
});