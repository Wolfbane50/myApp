// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-ui-select/dist/select.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/angular-animate/angular-animate.js',
      'client/bower_components/lodash/dist/lodash.compat.js',
      'client/bower_components/ngToast/dist/ngToast.js',
      'client/bower_components/angular-socket-io/socket.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/angular-validation-match/dist/angular-validation-match.min.js',
      'client/bower_components/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox.js',
      'client/bower_components/angular-ui-tree/dist/angular-ui-tree.js',
      'client/bower_components/file-saver/FileSaver.js',
      'client/bower_components/json-export-excel/src/json-export-excel.js',
      'client/bower_components/angular-css/angular-css.js',
      'client/bower_components/angular-touchspin/dist/angular-touchspin.js',
      'client/bower_components/videogular/videogular.js',
      'client/bower_components/videogular-controls/vg-controls.js',
      'client/bower_components/videogular-buffering/vg-buffering.js',
      'client/bower_components/videogular-overlay-play/vg-overlay-play.js',
      'client/bower_components/videogular-poster/vg-poster.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'node_modules/socket.io-client/socket.io.js',
      'client/app/app.js',
      'client/{app,components}/**/*.module.js',
      'client/{app,components}/**/*.js',
      'client/{app,components}/**/*.html'
    ],

    preprocessors: {
      '**/*.html': 'ng-html2js',
      'client/{app,components}/**/*.js': 'babel'
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    babelPreprocessor: {
      options: {
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 9020,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // reporter types:
    // - dots
    // - progress (default)
    // - spec (karma-spec-reporter)
    // - junit
    // - growl
    // - coverage
    reporters: ['spec'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    browserNoActivityTimeout: 100000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
