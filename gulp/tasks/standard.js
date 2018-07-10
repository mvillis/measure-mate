var gulp = require('gulp')
var semver = require('semver')
var log = require('fancy-log')
var colors = require('ansi-colors')
var config = require('../config').lint

if (semver.lt(process.version, '1.0.0')) {
  gulp.task('lint:standard', function (done) {
    log.warn(colors.magenta('WARNING:'), ' \'lint:standard\' task skipped: NodeJS is too old.')
    done()
  })
} else if (config.production) {
  gulp.task('lint:standard', function (done) {
    log.warn(colors.magenta('WARNING:'), ' \'lint:standard\' task skipped in production.')
    done()
  })
} else {
  var standard = require('gulp-standard')

  gulp.task('lint:standard', function () {
    return gulp.src(config.src)
      .pipe(standard())
      .pipe(standard.reporter('stylish', config.standard))
  })
}
