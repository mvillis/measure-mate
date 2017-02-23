var gulp = require('gulp')

gulp.task('build', gulp.series(
  'env:setup',
  gulp.parallel(
    'build:js', 'build:css', 'build:fonts', 'assets'
  ),
  gulp.parallel(
    'lint:js', 'lint:css', 'lint:markdown', 'test'
  ),
  function buildDone (done) {
    global.isBuilding = false
    done()
  }
))
