var gulp = require('gulp')
var concat = require('gulp-concat')
var uglifycss = require('gulp-uglifycss')
var sourcemaps = require('gulp-sourcemaps')
var browserSync = require('browser-sync')
var handleErrors = require('../util/handleErrors')
var config = require('../config').css

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
    .pipe(browserSync.reload({stream: true}))
})
