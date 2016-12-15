const webpack = require( 'webpack' );
const helpers = require( './helpers' );

/*
 * Webpack Plugins
 */
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );

const PATHS = {
    src: helpers.root( 'src' ),
    entry: helpers.root( 'src/main' ),
    build: helpers.root( 'www' ),
    appSettings: helpers.root( 'src/app/shared/settings/settings.json' )
};

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
const config = ( options = {} ) => {

    // build settings
    helpers.buildAppSettings( { env: options.env } );

    /*
    * Webpack Constants
    */
    const METADATA = {
        title: 'ES na palma da mão',
        baseUrl: '/',
        isDevServer: helpers.isWebpackDevServer(),
        isDev: options.env === 'development'
    };

    return {
        /*
         * Cache generated modules and chunks to improve performance for multiple incremental builds.
         * This is enabled by default in watch mode.
         * You can pass false to disable it.
         *
         * See: http://webpack.github.io/docs/configuration.html#cache
         */
        //cache: false,

        /*
         * The entry point for the bundle
         * Our Angular.js app
         *
         * See: http://webpack.github.io/docs/configuration.html#entry
         */
        entry: PATHS.entry,

        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.html$/,
                    loader: 'htmlhint-loader',
                    include: [ PATHS.src ],
                    exclude: [ helpers.root( 'src/index.html' ) ]
                },
                {
                    enforce: 'pre',
                    test: /\.ts$/,
                    loader: 'tslint-loader',
                    include: [ PATHS.src ]
                },
                {
                    test: /\.ts$/,
                    loader: 'awesome-typescript-loader',
                    include: [ PATHS.src ],
                    options: {
                        forkChecker: true,
                        useCache: true
                    }
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                    include: [ PATHS.src ],
                    exclude: [ helpers.root( 'src/index.html' ) ]
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
                    test: /\.css$/,
                    loaders: [ 'style-loader', 'css-loader' ]
                },
                {
                    test: /\.scss$/,
                    loaders: [ 'style-loader', 'css-loader', 'sass-loader' ]
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
                }
            ]
        },
        /*
        * Add additional plugins to the compiler.
        *
        * See: http://webpack.github.io/docs/configuration.html#plugins
        */
        plugins: [
            // Injects bundles in your index.html instead of wiring all manually.
            // It also adds hash to all injected assets so we don't have problems
            // with cache purging during deployment.
            new HtmlWebpackPlugin( {
                template: helpers.root( 'src/index.html' ),
                title: METADATA.title,
                filename: helpers.root( 'www/index.html' ),
                chunksSortMode: 'dependency',
                metadata: METADATA,
                inject: 'body',
                hash: true
            }),

            // ref: http://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack
            new webpack.ContextReplacementPlugin( /moment[\/\\]locale$/, /pt-br/ ),

            /**
            * Plugin LoaderOptionsPlugin (experimental)
            *
            * See: https://gist.github.com/sokra/27b24881210b56bbaff7
            */
            new webpack.LoaderOptionsPlugin( {} )
        ],


        resolve: {
            alias: {
                'font-awesome': helpers.root( 'node_modules/font-awesome/css/font-awesome.css' ),
                'roboto-fontface': helpers.root( 'node_modules/roboto-fontface/css/roboto/sass/roboto-fontface-regular.scss' ),
                'angular-material-css': helpers.root( 'node_modules/angular-material/angular-material.css' ),
                'angular-material': helpers.root( 'node_modules/angular-material/angular-material.js' ),
                'ionic': helpers.root( 'node_modules/ionic-angular/release/js/ionic.js' ),
                'ionic-angular': helpers.root( 'node_modules/ionic-angular/release/js/ionic-angular.js' ),
                'ionic-css': helpers.root( 'node_modules/ionic-angular/release/css/ionic.css' ),
                '@hoisel/ionic-calendar-css': helpers.root( 'node_modules/@hoisel/ionic-calendar/www/dist/css/calendar.css' )
            },
            extensions: [ '.ts', '.js' ],

            // An array of directory names to be resolved to the current directory
            modules: [ PATHS.src, 'node_modules' ]
        },


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
    };
};
module.exports = config;
