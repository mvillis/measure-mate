var gulp = require('gulp')
var util = require('gulp-util')
var semver = require('semver')
var config = require('../config').lint

if (semver.lt(process.version, '1.0.0')) {
  gulp.task('lint:standard', function (done) {
    util.log(util.colors.magenta('WARNING:'), ' \'lint:standard\' task skipped: NodeJS is too old.')
    done()
  })
} else if (config.production) {
  gulp.task('lint:standard', function (done) {
    util.log(util.colors.magenta('WARNING:'), ' \'lint:standard\' task skipped in production.')
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
