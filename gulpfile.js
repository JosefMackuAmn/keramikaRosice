var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglifycss = require('gulp-uglifycss');
var rename = require('gulp-rename');
var uglifyjs = require('gulp-uglify-es').default;

sass.compiler = require('node-sass');

var paths = {
    sass: {
        source: './src/scss/main.scss',
        destination: './public/css',
        filename: 'style.css'
    },
    sassAdmin: {
        source: './src/admin-scss/main.scss',
        destination: './public/css',
        filename: 'admin-style.css'
    },
    js: {
        source: './public/js/index.js',
        destination: './public/js',
        filename: 'index.bundle.js'
    }
};

gulp.task('sass', () => {
    return gulp.src(paths.sass.source)
    .pipe(rename(paths.sass.filename))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(uglifycss({
        "maxLineLen": 80,
        "uglyComments": true
    }))
    .pipe(gulp.dest(paths.sass.destination));
});
gulp.task('sass:admin', () => {
    return gulp.src(paths.sassAdmin.source)
    .pipe(rename(paths.sassAdmin.filename))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(uglifycss({
        "maxLineLen": 80,
        "uglyComments": true
    }))
    .pipe(gulp.dest(paths.sassAdmin.destination));
});

gulp.task('js', () => {
    return gulp.src(paths.js.source)
    .pipe(rename(paths.js.filename))
    .pipe(uglifyjs())
    .pipe(gulp.dest(paths.js.destination));
});