/* eslint-disable angular/json-functions */

const webpack = require( 'webpack' );
const helpers = require( './helpers' );
const merge = require( 'webpack-merge' ); // used to merge webpack configs
const commonConfig = require( './webpack.config.common' ); // the settings that are common to prod and development

const ENV = process.env.ENV = process.env.NODE_ENV = 'production';

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = options => {
    return merge( commonConfig( {} ), {
        entry: {
            vendors: [ helpers.root( 'src/app/vendors.ts' ) ]
        },
        output: {
            path: helpers.root( 'www' ),
            filename: 'dll.[name].js',
            library: '[name][chunkhash]'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    loaders: [ 'style-loader', 'css-loader' ]
                }
            ]
        },
        plugins: [
            new webpack.DllPlugin( {
                path: helpers.root( 'www/[name]-manifest.json' ),
                name: '[name][chunkhash]'
            }),

            /**
             * Plugin: DedupePlugin
            * Description: Prevents the inclusion of duplicate code into your bundle
            * and instead applies a copy of the function at runtime.
            *
            * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
            * See: https://github.com/webpack/docs/wiki/optimization#deduplication
            */
            new webpack.optimize.DedupePlugin(), // see: https://github.com/angular/angular-cli/issues/1587

            // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
            new webpack.DefinePlugin( {
                'ENV': JSON.stringify( ENV ),
                'HMR': false,
                'process.env': {
                    'ENV': JSON.stringify( ENV ),
                    'NODE_ENV': JSON.stringify( ENV ),
                    'HMR': false
                }
            }),

            /**
            * Plugin: UglifyJsPlugin
            * Description: Minimize all JavaScript output of chunks.
            * Loaders are switched into minimizing mode.
            *
            * See: https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            */
            // NOTE: To debug prod builds uncomment //debug lines and comment //prod lines
            new webpack.optimize.UglifyJsPlugin( {
                // beautify: true, //debug
                // mangle: false, //debug
                // dead_code: false, //debug
                // unused: false, //debug
                // deadCode: false, //debug
                // compress: {
                //   screw_ie8: true,
                //   keep_fnames: true,
                //   drop_debugger: false,
                //   dead_code: false,
                //   unused: false
                // }, // debug
                // comments: true, //debug
                beautify: false, //prod
                mangle: {
                    screw_ie8: true,
                    keep_fnames: true
                }, //prod
                compress: {
                    screw_ie8: true
                }, //prod
                comments: false //prod
            }),

            /**
            * Plugin LoaderOptionsPlugin (experimental)
            *
            * See: https://gist.github.com/sokra/27b24881210b56bbaff7
            */
            new webpack.LoaderOptionsPlugin( {
                debug: false,
                minimize: true
            })
        ],
        /*
        * Include polyfills or mocks for various node stuff
        * Description: Node configuration
        *
        * See: https://webpack.github.io/docs/configuration.html#node
        */
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    });
};





