var gulp = require('gulp')
var config = require('../config').build

gulp.task('build', gulp.series('env:setup',
  gulp.parallel(
    'build:js', 'build:css', 'build:fonts', 'assets'
  ),
  gulp.parallel(
    config.production ? [] : ['lint:js', 'lint:css', 'lint:markdown', 'test']
  ),
  function (done) {
    global.isBuilding = false
    done()
  }
))
