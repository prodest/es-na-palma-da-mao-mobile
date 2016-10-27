/* eslint-disable angular/json-functions */
const webpack = require( 'webpack' );
const helpers = require( './helpers' );

const PATHS = {
    src: helpers.root( 'src' ),
    entry: helpers.root( 'src/components/main' ),
    build: helpers.root( 'www' )
};

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = options => {
    return {

        /**
         * Source map for Karma from the help of karma-sourcemap-loader &  karma-webpack
         *
         * Do not change, leave as is or it wont work.
         * See: https://github.com/webpack/karma-webpack#source-maps
         */
        devtool: 'inline-source-map',


        /**
         * Options affecting the normal modules.
         *
         * See: http://webpack.github.io/docs/configuration.html#module
         */
        module: {

            rules: [

                /**
                 * Tslint loader support for *.ts files
                 *
                 * See: https://github.com/wbuchwalter/tslint-loader
                 */
                {
                    enforce: 'pre',
                    test: /\.ts$/,
                    loader: 'tslint-loader',
                    exclude: [ helpers.root( 'node_modules' ) ]
                },

                /**
                 * Typescript loader support for .ts and Angular 2 async routes via .async.ts
                 *
                 * See: https://github.com/s-panferov/awesome-typescript-loader
                 */
                {
                    test: /\.ts$/,
                    loader: 'awesome-typescript-loader',
                    query: {
                        // use inline sourcemaps for "karma-remap-coverage" reporter
                        sourceMap: false,
                        inlineSourceMap: true,
                        compilerOptions: {

                            // Remove TypeScript helpers to be injected
                            // below by DefinePlugin
                            removeComments: true

                        }
                    },
                    include: [ PATHS.src ]
                },

                {
                    test: /\.html$/,
                    include: [ PATHS.src ],
                    loader: 'html'
                },
                {
                    test: /\.(jpg|png)$/,
                    loader: 'url-loader',
                    include: PATHS.src,
                    options: {
                        limit: 25000
                    }
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader',
                    exclude: [ '/node_modules/' ]
                },
                {
                    test: /\.styl$/,
                    include: [ PATHS.src ],
                    loaders: [ 'style-loader', 'css-loader', 'stylus-loader' ]
                },
                {
                    test: /\.scss$/,
                    loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
                },
                {
                    test: /\.css$/,
                    loaders: [ 'style-loader', 'css-loader' ]
                },
                {
                    test: /\.woff|\.woff2/,
                    // Inline small woff files and output them below font/.
                    // Set mimetype just in case.
                    loader: 'url-loader',
                    options: {
                        name: 'fonts/[name].[hash].[ext]',
                        limit: 5000,
                        mimetype: 'application/font-woff'
                    }
                },
                {
                    test: /\.ttf|\.eot|\.svg/,
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[hash].[ext]'
                    }
                },

                /**
                 * Instruments JS files with Istanbul for subsequent code coverage reporting.
                 * Instrument only testing sources.
                 *
                 * See: https://github.com/deepsweet/istanbul-instrumenter-loader
                 */
                {
                    enforce: 'post',
                    test: /\.ts$/,
                    loader: 'istanbul-instrumenter-loader',
                    include: PATHS.src,
                    exclude: [
                        /\.specs\.ts$/,
                        /node_modules/
                    ]
                }

            ]
        },

        /**
         * Add additional plugins to the compiler.
         *
         * See: http://webpack.github.io/docs/configuration.html#plugins
         */
        plugins: [

            /**
             * Plugin: DefinePlugin
             * Description: Define free variables.
             * Useful for having development builds with debug logging or adding global constants.
             *
             * Environment helpers
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             */
            // NOTE: when adding more properties make sure you include them in custom-typings.d.ts
            new webpack.DefinePlugin( {
                'ENV': JSON.stringify( ENV ),
                'HMR': false,
                'process.env': {
                    'ENV': JSON.stringify( ENV ),
                    'NODE_ENV': JSON.stringify( ENV ),
                    'HMR': false
                }
            }),

            // ref: http://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack
            new webpack.ContextReplacementPlugin( /moment[\/\\]locale$/, /pt-br/ ),

            /**
            * Plugin LoaderOptionsPlugin (experimental)
            *
            * See: https://gist.github.com/sokra/27b24881210b56bbaff7
            */
            new webpack.LoaderOptionsPlugin( {
                debug: true,
                options: {

                    /**
                     * Static analysis linter for TypeScript advanced options configuration
                     * Description: An extensible linter for the TypeScript language.
                     *
                     * See: https://github.com/wbuchwalter/tslint-loader
                     */
                    tslint: {
                        emitErrors: false,
                        failOnHint: false,
                        resourcePath: 'src'
                    }
                }
            })
        ],

        /**
         * Options affecting the resolving of modules.
         *
         * See: http://webpack.github.io/docs/configuration.html#resolve
         */
        resolve: {
            alias: {
                'font-awesome': helpers.root( 'node_modules/font-awesome/css/font-awesome.css' ),
                'roboto-fontface': helpers.root( 'node_modules/roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss' ),
                'angular-material-css': helpers.root( 'node_modules/angular-material/angular-material.css' ),
                'ionic': helpers.root( 'node_modules/ionic-angular/release/js/ionic.js' ),
                'ionic-angular': helpers.root( 'node_modules/ionic-angular/release/js/ionic-angular.js' ),
                'ionic-css': helpers.root( 'node_modules/ionic-angular/release/css/ionic.css' ),
                'ionic-calendar-css': helpers.root( 'node_modules/ionic-calendar/www/dist/css/calendar.css' )
            },
            extensions: [ '.ts', '.js' ],

            // An array of directory names to be resolved to the current directory
            modules: [ PATHS.src, 'node_modules' ]
        },

        /**
         * Include polyfills or mocks for various node stuff
         * Description: Node configuration
         *
         * See: https://webpack.github.io/docs/configuration.html#node
         */
        node: {
            global: true,
            process: false,
            crypto: 'empty',
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    };
};
