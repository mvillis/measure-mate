var gulp = require('gulp')
var util = require('gulp-util')
var concat = require('gulp-concat')
var uglifycss = require('gulp-uglifycss')
var sourcemaps = require('gulp-sourcemaps')

var handleErrors = require('../util/handleErrors')
var config = require('../config').css

var browserSync = config.production || require('browser-sync')

gulp.task('css', function () {
  gulp.src(config.src)
    .pipe(sourcemaps.init({loadMaps: true}))
    // transforms here
    .pipe(concat('bundle.css'))
    // Report compile errors
    .on('error', handleErrors)
    .pipe(uglifycss(config.uglifyOptions))
    // Report compile errors
    .on('error', handleErrors)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest))
    .pipe(config.production ? util.noop() : browserSync.reload({stream: true}))
})
