var gulp = require('gulp')

gulp.task('build', ['envSetup', 'browserify', 'css', 'fonts', 'assets', 'templates', 'lint'], function () {
  global.isBuilding = false
})
