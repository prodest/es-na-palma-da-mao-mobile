const path = require( 'path' );

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

/*
 * get all the files, for each file, call the context function
 * that will require the file and load it up here. Context will
 * loop and require those spec files here
 */
function requireAll( requireContext ) {
    return requireContext.keys().map( requireContext );
}

exports.requireAll = requireAll;
exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;

