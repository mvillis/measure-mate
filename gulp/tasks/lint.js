var gulp = require('gulp')
var util = require('gulp-util')
var semver = require('semver')
var config = require('../config').lint

if (semver.lt(process.version, '1.0.0')) {
  gulp.task('lint', function () {
    util.log(util.colors.magenta('WARNING:'), ' \'lint\' task skipped: NodeJS is too old.')
  })
} else if (config.production) {
  gulp.task('lint', function () {
    util.log(util.colors.magenta('WARNING:'), ' \'lint\' task skipped in production.')
  })
} else {
  var lint = require('gulp-eslint')

  gulp.task('lint:js', function () {
    return gulp.src(config.src)
      .pipe(lint({config: config.configSrc}))
      .pipe(lint.format())
  })
}
