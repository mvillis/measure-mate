var browserSync = require('browser-sync')
var browserify = require('browserify')
var watchify = require('watchify')
var uglify = require('gulp-uglify')
var gzip = require('gulp-gzip')
var streamify = require('gulp-streamify')
var bundleLogger = require('../util/bundleLogger')
var gulp = require('gulp')
var util = require('gulp-util');
var handleErrors = require('../util/handleErrors')
var source = require('vinyl-source-stream')
var config = require('../config').browserify
// build check
var isWatching = require('../util/isWatching')

gulp.task('browserify', function (callback) {
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
        .pipe(config.production ? streamify(uglify()) : util.noop())
        .pipe(config.production ? streamify(gzip(config.gzipAppend)) : util.noop())
        // Specify the output destination
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished)
    };

    if (isWatching) {
      util.log('Enabling Watchify for Browserify')
      // Wrap with watchify and rebundle on changes
      bundler = watchify(bundler)
      // Rebundle on update
      bundler.on('update', bundle)
    }

    var reportFinished = function() {
      // Log when bundling completes
      bundleLogger.end(bundleConfig.outputName)

      if (bundleQueue) {
        bundleQueue--
        if (bundleQueue === 0) {
          // If queue is empty, tell gulp the task is complete.
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
          callback();
          // reload browserSync on changes
          browserSync.reload()
        } else {
          // reload browserSync on changes
          browserSync.reload()
        }
      }
    };

    return bundle()
  };

  // Start bundling with Browserify for each bundleConfig specified
  config.bundleConfigs.forEach(browserifyThis)
})
