var util = require('gulp-util')

var config = require('../config')

var startBrowserSync = function () { }

if (!config.production) {
  var _ = require('lodash')
  var assign = require('lodash.assign')
  var browserSync = require('browser-sync')

  var bsConfig = config.browserSync.all
  if (config.browserSyncDebug) {
    _.assign(bsConfig, config.browserSync.debug)
  }
  var mode = config.browserSyncMode + 'Options'
  assign(bsConfig, config.browserSync[mode])

  startBrowserSync = function () {
    if (global.isBuilding === true) {
      util.log('Build in progress...')
      setTimeout(startBrowserSync, 100)
    } else {
      util.log('Build complete, starting BrowserSync')
      browserSync(bsConfig)
    }
  }
}

module.exports = startBrowserSync
