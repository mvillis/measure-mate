var gulp = require('gulp')
var util = require('gulp-util')
var semver = require('semver')
var config = require('../config').lintCss

if (semver.lt(process.version, '1.0.0')) {
  gulp.task('lint:css', function (done) {
    util.log(util.colors.magenta('WARNING:'), ' \'lint:css\' task skipped: NodeJS is too old.')
    done()
  })
} else if (config.production) {
  gulp.task('lint:css', function (done) {
    util.log(util.colors.magenta('WARNING:'), ' \'lint:css\' task skipped in production.')
    done()
  })
} else {
  var gulpStylelint = require('gulp-stylelint')

  gulp.task('lint:css', function () {
    var options = Object.assign(
      {
        reporters: [
          {formatter: 'verbose', console: true}
        ]
      },
      config.lintOptions
    )

    return gulp
      .src(config.src)
      .pipe(gulpStylelint(options))
  })
}

