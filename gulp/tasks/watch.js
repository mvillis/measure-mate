/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp = require('gulp')
var util = require('gulp-util')
var config = require('../config')

if (config.production) {
  gulp.task('watch', function () {
    util.log(util.colors.magenta('WARNING:'), ' \'watch\' task skipped in production.')
  })
} else {
  var startBrowserSync = require('../util/startBrowserSync')

  gulp.task('watch', ['build'], function () {
    startBrowserSync()
    gulp.watch(config.assets.src, ['assets'])
    gulp.watch(config.css.src, ['lintCss', 'css'])
    gulp.watch([
      config.clientDir + '/js/**',
      config.clientDir + '/test/js/**'
    ], [
      'lint', 'test'
    ])
  })
}
