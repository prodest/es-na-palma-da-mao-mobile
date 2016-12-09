#!/usr/bin/env node

// each object in the array consists of a key which refers to the source and
// the value which is the destination.
var filestocopy = [
    { 'resources/android/images/extintor.png': 'platforms/android/res/drawable/extintor.png' },
    { 'resources/android/images/notification.png': 'platforms/android/res/drawable/notification.png' }
];

var fs = require( 'fs' );
var path = require( 'path' );

// no need to configure below
var rootdir = path.resolve( __dirname, '../../' ); // process.argv[ 2 ];

filestocopy.forEach( ( obj ) => {
    Object.keys( obj ).forEach( ( key ) => {
        var val = obj[ key ];
        var srcfile = path.join( rootdir, key );
        var destfile = path.join( rootdir, val );
        //console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname( destfile );
        if ( !fs.existsSync( destdir ) ) {
            fs.mkdirSync( destdir );
        }

        if ( fs.existsSync( srcfile ) && fs.existsSync( destdir ) ) {
            fs.createReadStream( srcfile )
                .pipe( fs.createWriteStream( destfile ) );
        }
    } );
} );
