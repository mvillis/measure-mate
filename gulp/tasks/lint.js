var gulp = require('gulp')
var util = require('gulp-util')
var semver = require('semver')
var config = require('../config').lint

if (semver.lt(process.version, '1.0.0')) {
  gulp.task('lint', function (done) {
    util.log(util.colors.magenta('WARNING:'), ' \'lint\' task skipped: NodeJS is too old.')
    done()
  })
} else if (config.production) {
  gulp.task('lint', function (done) {
    util.log(util.colors.magenta('WARNING:'), ' \'lint\' task skipped in production.')
    done()
  })
} else {
  var lint = require('gulp-eslint')

  gulp.task('lint', function () {
    return gulp.src(config.src)
      .pipe(lint({config: config.configSrc}))
      .pipe(lint.format())
  })
}
