var gulp = require('gulp')
var util = require('gulp-util')
var concat = require('gulp-concat')
var uglifycss = require('gulp-uglifycss')
var sourcemaps = require('gulp-sourcemaps')

var handleErrors = require('../util/handleErrors')
var config = require('../config').css

var reload = util.noop
if (!config.production) {
  reload = require('browser-sync').reload
}

gulp.task('build:css', function () {
  return gulp.src(config.src)
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
    .pipe(reload({stream: true}))
})
