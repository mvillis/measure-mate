'use strict'
var gulp = require('gulp')
var requireDir = require('require-dir')

var config = require('./gulp/config')

// Require all tasks in gulp/tasks, including subfolders
requireDir('./gulp/tasks', { recurse: true })

if (config.production) {
  gulp.task('default', 'build')
} else {
  gulp.task('default', 'build-watch')
}
