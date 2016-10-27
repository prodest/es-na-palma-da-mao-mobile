const argv = require('yargs')
             .default('target', 'tests')
             .argv;

const FILES_PATTERN = `./config/karma.files.${argv.target}.js`;
const preprocessors = [ 'webpack', 'sourcemap' ];
const reporters = [ 'mocha' ];

if ( argv.coverage ) {
    preprocessors.unshift( 'coverage' );
    reporters.push( ...['coverage', 'remap-coverage'] );
}

if ( process.env.TRAVIS ) {
    reporters.push( 'coveralls' );
} 

module.exports = config => {

    const testWebpackConfig = require( './webpack.config.test.js' )( { env: 'test' });

    const configuration = {
        /**
         * This path will be used for resolving.
         */
        basePath: '',

        /**
         * List of test frameworks we will use. Most of them are provided by separate packages (adapters).
         * You can find them on npmjs.org: https://npmjs.org/browse/keyword/karma-adapter
         */
        frameworks: [
            'mocha', 'chai', 'sinon-stub-promise', 'sinon', 'es6-shim'
        ],

        // list of files to exclude
        exclude: [],

        /**
         * Entry point / test environment builder is also written in TypeScript.
         */
        files: [ { pattern: FILES_PATTERN, watched: false } ],

        /**
         * Transform files before loading them.
         */
        preprocessors: {
            [FILES_PATTERN]: preprocessors
        },

        // Webpack Config at ./webpack.test.js
        webpack: testWebpackConfig,

        // Webpack please don't spam the console when running in karma!
        webpackMiddleware: { stats: 'errors-only' },

        /**
         * A lot of plugins are available for test results reporting.
         * You can find them here: https://npmjs.org/browse/keyword/karma-reporter
         */
        reporters: reporters,

        /**
         * This JSON file is "intermediate", in post-test script we use remap-istanbul to map back to TypeScript
         * and then generate coverage report.
         */
        coverageReporter: {
            type: 'in-memory'
        },

        remapCoverageReporter: {
            'text-summary': null,
            json: './coverage/coverage.json',
            html: './coverage/html',
            lcovonly: './coverage/lcov.info'
        },
        /**
         * Only Phantom is used in this example.
         * You can find more browser launchers here: https://npmjs.org/browse/keyword/karma-launcher
         */
        browsers: [ 'PhantomJS' ],

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        /*
        * Continuous Integration mode
        * if true, Karma captures browsers, runs the tests and exits
        */
        singleRun: true,

        browserNoActivityTimeout: 60000,
        concurrency: Infinity,
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO
    };

    config.set( configuration );
};
