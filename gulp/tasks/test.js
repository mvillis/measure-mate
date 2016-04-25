var gulp = require('gulp')
var mocha = require('gulp-mocha')
var config = require('../config').test
require('babel-core/register')

gulp.task('test', function () {
  return gulp.src(config.src, {read: false})
      .pipe(mocha(config.mochaOptions))
})
