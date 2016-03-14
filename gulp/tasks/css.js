var gulp = require('gulp')
var concat = require('gulp-concat')
var sourcemaps = require('gulp-sourcemaps')
var browserSync = require('browser-sync')
var handleErrors = require('../util/handleErrors')
var config = require('../config').css

gulp.task('css', function () {
  gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.css'))
    .on('error', handleErrors)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream: true}))
})
