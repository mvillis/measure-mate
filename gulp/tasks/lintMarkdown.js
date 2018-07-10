var gulp = require('gulp')
var through2 = require('through2')
var log = require('fancy-log')
var colors = require('ansi-colors')
var config = require('../config').markdownlint

if (config.production) {
  gulp.task('lint:markdown', function (done) {
    log.warn(colors.magenta('WARNING:'), ' \'lint:markdown\' task skipped in production.')
    done()
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
