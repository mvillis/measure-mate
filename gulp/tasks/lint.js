var gulp = require('gulp')
var util = require('gulp-util')
var semver = require('semver')

if (semver.gt(process.version, '1.0.0')) {
  var lint = require('gulp-eslint')
  var config = require('../config').lint

  gulp.task('lint:js', function () {
    return gulp.src(config.src)
      .pipe(lint({config: config.configSrc}))
      .pipe(lint.format())
  })
} else {
  gulp.task('lint:js', function () {
    return util.log(util.colors.magenta('WARNING:'), ' \'lint:js\' task skipped: NodeJS is too old.')
  })
}
