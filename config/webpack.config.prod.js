/* eslint-disable angular/json-functions */
const webpack = require( 'webpack' );
const helpers = require( './helpers' );
const merge = require( 'webpack-merge' ).smart; // used to merge webpack configs
const commonConfigFactory = require( './webpack.config.common' ); // the settings that are common to prod and dev

/**
 * Webpack Plugins
 */
const WebpackMd5Hash = require( 'webpack-md5-hash' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );



/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = ( options = {} ) => {

    const ENV = process.env.ENV = process.env.NODE_ENV = options.env || 'production';
    const HOST = process.env.HOST || 'localhost';
    const PORT = process.env.PORT || 3000;

    const commonConfig = commonConfigFactory( { env: ENV });

    const METADATA = merge( commonConfig.metadata, {
        host: HOST,
        port: PORT,
        ENV: ENV,
        HMR: false
    });

    return merge( commonConfig, {
        /**
         * Developer tool to enhance debugging
         *
         * See: http://webpack.github.io/docs/configuration.html#devtool
         * See: https://github.com/webpack/docs/wiki/build-performance#sourcemaps
         */
        devtool: 'source-map',

        /**
         * Options affecting the output of the compilation.
         *
         * See: http://webpack.github.io/docs/configuration.html#output
         */
        output: {

            /**
             * The output directory as absolute path (required).
             *
             * See: http://webpack.github.io/docs/configuration.html#output-path
             */
            path: helpers.root( 'www' ),

            /**
             * Specifies the name of each output file on disk.
             * IMPORTANT: You must not specify an absolute path here!
             *
             * See: http://webpack.github.io/docs/configuration.html#output-filename
             */
            filename: '[name].[chunkhash].bundle.js',

            /**
             * The filename of the SourceMaps for the JavaScript files.
             * They are inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-sourcemapfilename
             */
            sourceMapFilename: '[name].[chunkhash].bundle.map',

            /** The filename of non-entry chunks as relative path
             * inside the output.path directory.
             *
             * See: http://webpack.github.io/docs/configuration.html#output-chunkfilename
             */
            chunkFilename: '[id].[chunkhash].chunk.js'
        },
        module: {
            rules: [
                // Extract CSS during build
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract( {
                        fallbackLoader: 'style-loader',
                        loader: [ 'css-loader', 'sass-loader' ]
                    })
                }
            ]
        },
        plugins: [

            new webpack.DllReferencePlugin( {
                manifest: require( helpers.root( 'www/vendors-manifest.json' ) )
            }),

            // Output extracted CSS to a file
            new ExtractTextPlugin( '[name].[chunkhash].css' ),

            /**
             * Plugin: WebpackMd5Hash
             * Description: Plugin to replace a standard webpack chunkhash with md5.
             *
             * See: https://www.npmjs.com/package/webpack-md5-hash
             */
            new WebpackMd5Hash(),

            /**
             * Plugin: DefinePlugin
             * Description: Define free variables.
             * Useful for having development builds with debug logging or adding global constants.
             *
             * Environment helpers
             *
             * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
             */
            // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
            new webpack.DefinePlugin( {
                'ENV': JSON.stringify( METADATA.ENV ),
                'HMR': METADATA.HMR,
                'process.env': {
                    'ENV': JSON.stringify( METADATA.ENV ),
                    'NODE_ENV': JSON.stringify( METADATA.ENV ),
                    'HMR': METADATA.HMR
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
                sourceMap: true,
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
