var gulp = require('gulp')
var util = require('gulp-util')
var through2 = require('through2')
var config = require('../config').markdownlint

if (config.production) {
  gulp.task('lint:markdown', function () {
    util.log(util.colors.magenta('WARNING:'), ' \'lint-markdown\' task skipped in production.')
  })
} else {
  var markdownlint = require('markdownlint')

  gulp.task('lint:markdown', function () {
    return gulp.src(config.src, { 'read': false })
      .pipe(through2.obj(function (file, enc, next) {
        markdownlint(
          { 'files': [ file.relative ] },
          function (err, result) {
            var resultString = (result || '').toString()
            if (resultString) {
              console.log(resultString)
            }
            next(err, file)
          })
      }))
  })
}
