var util = require('gulp-util')
var production = !!util.env.production

var dest = 'build'
var src = 'client'

var cssSource = [
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'node_modules/react-select/dist/react-select.min.css',
  'client/css/measure-mate.css'
]
var cssDestination = dest + '/css'
var assetsSource = src + '/assets/**'
var assetsDestination = dest + '/assets'
var fontsSource = [
  'node_modules/bootstrap/dist/fonts/**',
  'client/fonts/**'
]
var fontsDestination = dest + '/fonts'
var imagesSource = src + '/assets/img/**/*.{gif,jpg,jpeg,tiff,png,svg}'
var imagesDestination = src + '/assets/img'
var templatesSource = 'templates/**'
var templatesDestination = dest

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
    production: production,
    processImages: /\.(gif|jpg|jpeg|tiff|png)$/i,
    imageminOptions: {
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      // png optimization
      optimizationLevel: 1
    },
    imgSrc: imagesSource,
    imgDest: imagesDestination
  },

  envSetup: {
    production: production
  },

  build: {
    production: production,
    prod_tasks: ['browserify', 'css', 'fonts', 'assets', 'templates'],
    test_tasks: ['browserify', 'css', 'fonts', 'assets', 'templates', 'lint', 'lintCss', 'markdownlint', 'test']
  },

  templates: {
    // *Note* templates don't use the common src
    src: templatesSource,
    dest: templatesDestination
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
    src: [
      'gulpfile.js',
      './client/js/main.js',
      './client/js/**/*.js',
      './client/test/js/**/*.js'
    ],
    configSrc: '.eslintrc.json'
  },

  test: {
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
      global: 0,
    }
  },

  lintCss: {
    src: [
      'client/css/*.css'
    ],
    lintOptions: {
      debug: true
    }
  },

  markdownlint: {
    src: [
      '*.md'
    ],
    lintOptions: {
      default: true
    }
  }
}
