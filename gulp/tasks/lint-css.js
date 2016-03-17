var gulp = require('gulp')
var gulpStylelint = require('gulp-stylelint').default
var consoleReporter = require('gulp-stylelint-console-reporter').default
var config = require('../config').lintCss
 
gulp.task('lint-css', function lintCssTask() {
  var options = Object.assign({
    reporters: [
      consoleReporter()
    ]},
    config.lintOptions)

  return gulp
    .src(config.src)
    .pipe(gulpStylelint(options))
});
