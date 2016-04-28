var gulp = require('gulp')
var runSequence = require('run-sequence')
var config = require('../config').build

gulp.task('build', function (callback) {
  runSequence('envSetup', config.production ? config.prod_tasks : config.test_tasks, callback)
  global.isBuilding = false
})
