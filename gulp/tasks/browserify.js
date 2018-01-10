var browserify = require('browserify')
var uglify = require('gulp-uglify')
var gulp = require('gulp')
var util = require('gulp-util')
var source = require('vinyl-source-stream')
var sourcemaps = require('gulp-sourcemaps')
var buffer = require('vinyl-buffer')

var config = require('../config').browserify

var bundleLogger = require('../util/bundleLogger')
var handleErrors = require('../util/handleErrors')
// build check
var isWatching = require('../util/isWatching')

var reload = function () { }
var watchify = function () { }

if (!config.production) {
  reload = require('browser-sync').reload
  watchify = require('watchify')
}

gulp.task('build:js', function (callback) {
  var bundleQueue = config.bundleConfigs.length

  var browserifyThis = function (bundleConfig) {
    var bundler = browserify({
      // Required watchify args
      cache: {},
      packageCache: {},
      // full system file paths, disable for production
      fullPaths: !config.production,
      // Add file extentions to make optional in your requires
      extensions: config.extensions,
      // Enable source maps
      debug: true
    })
      // Specify the entry point of your app
      .require(bundleConfig.entries, {entry: true})

    var reportFinished = function () {
      // Log when bundling completes
      bundleLogger.end(bundleConfig.outputName)

      if (bundleQueue) {
        // reload browserSync on changes
        reload()

        bundleQueue--
        if (bundleQueue === 0) {
          // If queue is empty, tell gulp the task is complete.
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
          return callback()
        }
      }
    }

    var bundle = function () {
      // Log when bundling starts
      bundleLogger.start(bundleConfig.outputName)
      return bundler
        .bundle()
        // Report compile errors
        .on('error', handleErrors)
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specifiy the
        // desired output filename here.
        .pipe(source(bundleConfig.outputName))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // transforms here
        .pipe(config.production ? uglify() : util.noop())
        // Report compile errors
        .on('error', handleErrors)
        .pipe(sourcemaps.write('./'))
        // Specify the output destination
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished)
    }

    if (!config.production && isWatching) {
      util.log('Enabling Watchify for Browserify')
      // Wrap with watchify and rebundle on changes
      bundler = watchify(bundler)
      // Rebundle on update
      bundler.on('update', bundle)
    }

    return bundle()
  }

  // Start bundling with Browserify for each bundleConfig specified
  config.bundleConfigs.forEach(browserifyThis)
})
