var gulp = require('gulp')
var util = require('gulp-util')
var semver = require('semver')

if (semver.gt(process.version, '1.0.0')) {
  var standard = require('gulp-standard')
  var config = require('../config')

  gulp.task('lint:standard', function () {
    return gulp.src(config.lint.src)
      .pipe(standard())
      .pipe(standard.reporter('stylish', config.standard))
  })
} else {
  gulp.task('lint:standard', function () {
    return util.log(util.colors.magenta('WARNING:'), ' \'lint:standard\' task skipped: NodeJS is too old.')
  })
}
