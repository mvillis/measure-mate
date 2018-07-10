/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp = require('gulp')
var log = require('fancy-log')
var colors = require('ansi-colors')
var env = require('../util/env')
var config = require('../config')

if (config.production || env.production) {
  gulp.task('watch', function (done) {
    log.warn(colors.magenta('WARNING:'), ' \'watch\' task skipped in production.')
    done()
  })
} else {
  var startBrowserSync = require('../util/startBrowserSync')

  gulp.task('watch', function () {
    startBrowserSync()
    gulp.watch(config.assets.src, ['assets'])
    gulp.watch(config.css.src, ['lint-css', 'css'])
    gulp.watch([
      config.clientDir + '/js/**',
      config.clientDir + '/test/js/**'
    ], [
      'lint', 'test'
    ])
  })
}
