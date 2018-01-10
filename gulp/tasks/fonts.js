var gulp = require('gulp')
var config = require('../config').fonts

gulp.task('build:fonts', function () {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest))
})
