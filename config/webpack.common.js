const webpack = require( 'webpack' );
const helpers = require( './helpers' );
/*
 * Webpack Plugins
 */
// problem with copy-webpack-plugin
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const ForkCheckerPlugin = require( 'awesome-typescript-loader' ).ForkCheckerPlugin;

const PATHS = {
    src: helpers.root( 'src' ),
    entry: helpers.root( 'src/components/main' ),
    build: helpers.root( 'www' )
};


/*
 * Webpack Constants
 */
const METADATA = {
  title: 'ES na palma da mão',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
};

/*
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
const config = (options) => {
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
                    include: [ PATHS.src ]
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
                    include: [ PATHS.src ],
                    loader: 'html-loader'
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

             /**
            * Plugin: IgnorePlugin
            * Description: Don’t generate modules for requests matching the provided RegExp.
            *
            * See: http://webpack.github.io/docs/list-of-plugins.html#ignoreplugin
            */
            // new webpack.IgnorePlugin(/\.ttf|\.eot|\.svg/),

            /*
             * Plugin: ForkCheckerPlugin
             * Description: Do type checking in a separate process, so webpack don't need to wait.
             *
             * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
             */
            new ForkCheckerPlugin(),

            // Injects bundles in your index.html instead of wiring all manually.
            // It also adds hash to all injected assets so we don't have problems
            // with cache purging during deployment.
            new HtmlWebpackPlugin( {
                template: helpers.root( 'src/index.html' ),
                title: METADATA.title,
                chunksSortMode: 'dependency',
                metadata: METADATA,
                inject: 'body',
                hash: true
            }),

            // Automatically move all modules defined outside of application directory to vendor bundle.
            // If you are using more complicated project structure, consider to specify common chunks manually.
            new webpack.optimize.CommonsChunkPlugin( {
                name: 'vendor',
                minChunks: ( mod ) => {
                    return mod.resource && mod.resource.indexOf( PATHS.src ) === -1 &&
                        mod.resource.indexOf( 'package.json' ) === -1;
                }
            }),

            // ref: http://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack
            new webpack.ContextReplacementPlugin( /moment[\/\\]locale$/, /pt-br/ ),

            /**
            * Plugin LoaderOptionsPlugin (experimental)
            *
            * See: https://gist.github.com/sokra/27b24881210b56bbaff7
            */
            new webpack.LoaderOptionsPlugin({})
        ],


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
