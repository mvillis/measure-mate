var gulp = require('gulp')
var concat = require('gulp-concat')
var uglifycss = require('gulp-uglifycss')
var sourcemaps = require('gulp-sourcemaps')
var util = require('gulp-util')
var browserSync = require('browser-sync')
var handleErrors = require('../util/handleErrors')
var config = require('../config').css

gulp.task('css', function () {
  gulp.src(config.src)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('bundle.css'))
    .on('error', handleErrors)
    .pipe(uglifycss(config.uglifyOptions))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream: true}))
})
