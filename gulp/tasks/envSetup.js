var gulp = require('gulp')
var config = require('../config').envSetup

gulp.task('envSetup', function (done) {
  process.env.NODE_ENV = (config.production ? 'production' : 'development')
  done()
})
