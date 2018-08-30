var gulp = require('gulp')
var semver = require('semver')
var log = require('fancy-log')
var colors = require('ansi-colors')
var config = require('../config').lint

if (semver.lt(process.version, '1.0.0')) {
  gulp.task('lint:js', function (done) {
    log.warn(colors.magenta('WARNING:'), ' \'lint:js\' task skipped: NodeJS is too old.')
    done()
  })
} else if (config.production) {
  gulp.task('lint:js', function (done) {
    log.warn(colors.magenta('WARNING:'), ' \'lint:js\' task skipped in production.')
    done()
  })
} else {
  var lint = require('gulp-eslint')

  gulp.task('lint:js', function () {
    return gulp.src(config.src)
      .pipe(lint({ config: config.configSrc }))
      .pipe(lint.format())
  })
}
