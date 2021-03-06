var env = require('./util/env')
var production = !!env.production

var dest = 'build'
var src = 'client'

var cssSource = [
  'node_modules/bootstrap/dist/css/bootstrap.css',
  'node_modules/bootstrap/dist/css/bootstrap-theme.css',
  'node_modules/react-select/dist/react-select.css',
  'client/css/*.css'
]
var cssDestination = dest + '/css'
var assetsSource = src + '/assets/**'
var assetsDestination = dest + '/assets'
var fontsSource = [
  'node_modules/bootstrap/dist/fonts/**',
  'client/fonts/**'
]
var fontsDestination = dest + '/fonts'

module.exports = {

  clientDir: src,

  browserSyncMode: 'proxy',
  browserSyncDebug: false,

  browserSync: {
    all: {
      port: process.env.PORT || 3000,
      // open browser window on start
      open: true,
      browser: 'google chrome'
    },
    debug: {
      logFileChanges: true,
      logLevel: 'debug'
    },
    serverOptions: {
      server: {
        baseDir: dest
      },
      files: [
        dest + '/**',
        // Exclude Map files
        '!' + dest + '/**.map'
      ]
    },
    proxyOptions: {
      proxy: 'localhost:8000'
    }
  },

  css: {
    src: cssSource,
    dest: cssDestination,
    production: production,
    uglifyOptions: {
      'maxLineLen': 80,
      'uglyComments': true
    }
  },

  fonts: {
    src: fontsSource,
    dest: fontsDestination
  },

  assets: {
    src: assetsSource,
    dest: assetsDestination,
    production: production
  },

  envSetup: {
    production: production
  },

  build: {
    production: production
  },

  browserify: {
    // Additional file extentions to make optional
    // extensions: ['.coffee', '.hbs'],
    extensions: [' ', 'js', 'jsx'],

    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: './' + src + '/js/main.js',
      dest: dest + '/js',
      outputName: 'bundle.js'
    }],
    production: production
  },

  lint: {
    production: production,
    src: [
      'gulpfile.js',
      './gulp/*.js',
      './gulp/**/*.js',
      './client/js/main.js',
      './client/js/**/*.js',
      './client/test/js/**/*.js'
    ],
    configSrc: '.eslintrc.json'
  },

  test: {
    production: production,
    src: './client/js/**/*.js',
    testSrc: './client/**/*test.js',
    mochaOptions: {
      'ui': 'bdd',
      'reporter': 'spec'
    },
    istanbulReportOptions: {
      reporters: [ 'lcov', 'json' ]
    },
    istanbulThresholds: {
      global: 0
    }
  },

  lintCss: {
    production: production,
    src: [
      'client/css/*.css'
    ],
    lintOptions: {
      debug: true
    }
  },

  markdownlint: {
    production: production,
    src: [
      '*.md'
    ],
    lintOptions: {
      default: true
    }
  },

  standard: {
    production: production,
    breakOnError: true,
    quiet: true
  }
}
