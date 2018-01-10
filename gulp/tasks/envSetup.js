var gulp = require('gulp')
var config = require('../config').envSetup

gulp.task('env:setup', function (done) {
  process.env.NODE_ENV = (config.production ? 'production' : 'development')
  done()
})
