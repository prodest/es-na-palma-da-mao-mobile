import { IRequestShortcutConfig, IRequestConfig } from 'angular';

/**
 * Make $http service calls return ES2015 Promises instead of ng.IPromises
 * 
 * refs: 
 *   - http://igwejk.github.io/angular-http-decoration-with-cancellation/
 *   - http://manikanta.com/blog/2013/07/25/decorate-angularjs-http-service-to-convert-put/
 * @param {any} $provide
 */
const httpDecoratorConfig = $provide => {
    const httpDecorator = $delegate => {

        // monkey patch $http service itself
        let $http: any = function ( config: IRequestConfig ) {
            const response = $delegate.call( undefined, config );

            // converts angular.IPromise to ES2015 Promise
            return Promise.resolve( response );
        };

        // Making default $http properties available.
        Object.keys( $delegate ).forEach( property => {
            if ( angular.isFunction( $http[ property ] ) ) {
                $http[ property ] = $delegate[ property ];
            }
        });

        // Implementing short methods
        [ 'delete', 'head', 'jsonp' ].forEach( method => {
            $http[ method ] = ( url: string, config: IRequestShortcutConfig ) => {
                config = angular.extend( config || {}, {
                    method: method,
                    url: url
                });
                return $http( config );
            };
        });

        [ 'post', 'put', 'patch' ].forEach( method => {
            $http[ method ] = ( url: string, data: any, config: IRequestShortcutConfig ) => {
                config = angular.extend( config || {}, {
                    method: method,
                    url: url,
                    data: data
                });
                return $http( config );
            };
        });

        // monkey patch $http get method
        $http.get = function ( url: string, config: IRequestShortcutConfig ) {
            // Quick and simple check for static html request.
            // Based on heuristics, it's best if requests for templates are
            // not interferred with, they should directly use original implementation.
            const templateRequest = url.substring( url.lastIndexOf( '/' ) + 1 ).indexOf( '.htm' ) !== -1;

            config = angular.extend( config || {}, {
                method: 'GET',
                url: url
            });

            return ( templateRequest ? $delegate : $http )( config );
        };

        return $http;

        // // create function which overrides $http function
        // const httpStub = function (method) {

        //     return function(url: string, config?: IRequestShortcutConfig) {

        //         config = angular.extend(config || {}, { url: url, method: method } );

        //         if ( url.indexOf('https://api.es.gov.br/') !== -1) {
        //             return Promise.resolve( $delegate(config) );
        //         }
        //         return $delegate(config);
        //     };
        // };

        // $delegate.get = httpStub('get');
        // $delegate.post = httpStub('post');
        // return $delegate;
    };

    $provide.decorator( '$http', [ '$delegate', httpDecorator ] );
};

httpDecoratorConfig.$inject = [ '$provide' ];

export default httpDecoratorConfig;