/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp = require('gulp')
var config = require('../config')
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
