let config;

// Look in ./config folder for webpack.dev.js
switch ( process.env.NODE_ENV ) {
    case 'prod':
    case 'production':
        break;
    case 'test':
    case 'testing':
        config = require( './config/webpack.test' )( { env: 'test' });
        break;
    case 'dev':
    case 'development':
    default:
        config = require( './config/webpack.dev' )( { env: 'development' });
}

module.exports = config;
