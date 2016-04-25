var gulp = require('gulp')
var runSequence = require('run-sequence')

gulp.task('build', function (callback) {
  runSequence('envSetup', ['browserify', 'css', 'fonts', 'assets', 'templates', 'lint', 'lintCss', 'markdownlint', 'test'], callback)
  global.isBuilding = false
})
