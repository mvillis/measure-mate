var gulp = require('gulp')
var browserSync = require('browser-sync')
var gzip = require('gulp-gzip')
var handleErrors = require('../util/handleErrors')
var config = require('../config').gzip

gulp.task('gzip', function () {
  gulp.src(config.src)
    .pipe(gzip(config.gzipConfig))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream: true}))
})
