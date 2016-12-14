#!/usr/bin/env node

// each object in the array consists of a key which refers to the source and
// the value which is the destination.
var filestocopy = [
    { 'resources/android/icon-push/': 'platforms/android/res/' }
];

var fs = require( 'fs' );
var path = require( 'path' );

// no need to configure below
var rootdir = path.resolve( __dirname, '../../' ); // process.argv[ 2 ];

const copyRecursiveSync = ( src, dest ) => {
    var exists = fs.existsSync( src );
    var stats = exists && fs.statSync( src );
    var isDirectory = stats.isDirectory();
    if ( isDirectory ) {
        if ( !fs.existsSync( dest ) ) {
            fs.mkdirSync( dest );
        }
        fs.readdirSync( src )
            .forEach( function( childItemName ) {
                copyRecursiveSync( path.join( src, childItemName ), path.join( dest, childItemName ) );
            } );
    } else {
        if ( fs.existsSync( src ) ) {
            fs.createReadStream( src )
                .pipe( fs.createWriteStream( dest ) );
        }
    }
};

filestocopy.forEach( ( obj ) => {
    Object.keys( obj ).forEach( ( key ) => {
        var val = obj[ key ];
        var srcPath = path.join( rootdir, key );
        var destPath = path.join( rootdir, val );

        copyRecursiveSync( srcPath, destPath );
    } );
} );
