var gulp = require('gulp')
var config = require('../config').envSetup

gulp.task('envSetup', function () {
  config.production ? process.env.NODE_ENV = 'production' : process.env.NODE_ENV = 'development'
})
