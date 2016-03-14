var gulp = require('gulp')
var concat = require('gulp-concat')
var browserSync = require('browser-sync')
var handleErrors = require('../util/handleErrors')
var config = require('../config').css

gulp.task('css', function () {
  gulp.src(config.src)
    .pipe(concat('bundle.css'))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream: true}))
})
