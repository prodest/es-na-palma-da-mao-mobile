import statesJson = require( './states.json' );

export default angular.module( 'shared.routes', [] );

export * from './model/index';
export { statesJson };

