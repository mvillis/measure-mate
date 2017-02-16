var gulp = require('gulp')
var util = require('gulp-util')
var config = require('../config').test

if (config.production) {
  gulp.task('test', function () {
    util.log(util.colors.magenta('WARNING:'), ' \'test\' task skipped in production.')
  })
} else {
  var mocha = require('gulp-mocha')
  var babel = require('gulp-babel')
  var istanbul = require('gulp-babel-istanbul')
  var injectModules = require('gulp-inject-modules')
  require('babel-core/register')

  gulp.task('test:setup', function () {
    return gulp.src(config.src)
      // Covering files
      .pipe(istanbul({includeUntested: true}))
      // Force `require` to return covered files
      .pipe(istanbul.hookRequire())
  })

  gulp.task('test:exec', function () {
    return gulp.src(config.testSrc)
      .pipe(babel())
      .pipe(injectModules())
      .pipe(mocha(config.mochaOptions))
      // Creating the reports after tests ran
      .pipe(istanbul.writeReports(config.istanbulReportOptions))
      // Enforce a coverage of at least 90%
      .pipe(istanbul.enforceThresholds({ thresholds: config.istanbulThresholds }))
  })

  gulp.task('test', gulp.series('test:setup', 'test:exec'))
}
