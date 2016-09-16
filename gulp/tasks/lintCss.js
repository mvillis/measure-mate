var gulp = require('gulp')
var util = require('gulp-util')
var semver = require('semver')

if (semver.gt(process.version, '1.0.0')) {
  var gulpStylelint = require('gulp-stylelint')
  var config = require('../config').lintCss

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
} else {
  gulp.task('lint:css', function () {
    return util.log(util.colors.magenta('WARNING:'), ' \'lint:css\' task skipped: NodeJS is too old.')
  })
}

