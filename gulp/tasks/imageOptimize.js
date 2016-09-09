var gulp = require('gulp')
var util = require('gulp-util')
var semver = require('semver')

if (semver.gt(process.version, '1.0.0')) {
  var imagemin = require('gulp-imagemin')
  var config = require('../config').assets

  // In place modifications - don't use as a watch task
  // It is recommended to stop any watch process you may have
  //  running prior to running this task.
  gulp.task('assets:image-optimize', function () {
    return gulp.src(config.imgSrc)
      .pipe(imagemin(config.imageminOptions))
      .pipe(gulp.dest(config.imgDest))
  })
} else {
  gulp.task('assets:image-optimize', function () {
    return util.log(util.colors.magenta('WARNING:'), ' \'assets:image-optimize\' task skipped: NodeJS is too old.')
  })
}
