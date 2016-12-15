/* eslint-disable angular/json-functions, angular/log, no-console */
const path = require( 'path' );
const fs = require( 'fs' );
const chalk = require( 'chalk' );
const dotenv = require( 'dotenv' );

// Helper functions
const ROOT = path.resolve( __dirname, '..' );

function hasProcessFlag( flag ) {
    return process.argv.join( '' ).indexOf( flag ) > -1;
}

function isWebpackDevServer() {
    return process.argv[ 1 ] && !!( /webpack-dev-server/.exec( process.argv[ 1 ] ) );
}

function root( args ) {
    args = Array.prototype.slice.call( arguments, 0 );
    return path.join.apply( path, [ ROOT ].concat( args ) );
}

function buildAppSettings( config ) {

    // apply default values
    const options = Object.assign( {}, { env: 'development', outputPath: root( 'src/app/shared/settings/settings.json' ) }, config );

    // Here, we use dotenv to load our env vars in the .env, into process.env
    if ( fs.existsSync( '.env' ) ) {
        dotenv.load();
    }
    const settings = require( root( 'config/app.settings' ) );
    fs.writeFileSync( options.outputPath, JSON.stringify( settings[ options.env ], null, 4 ) );

    console.log( chalk.yellow( `Settings geradas para env: ${chalk.bold( options.env )}` ) );
}
exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.buildAppSettings = buildAppSettings;
exports.root = root;

