let httpTrafficInterceptorConfig = $httpProvider => {
    let httpTrafficInterceptor = ( httpSnifferService ) => {

        // I attempt to extract the HTTP method from the given response. If
        // another interceptor has altered the response (albeit a very
        // unlikely occurrence), then we may not be able to access the config
        // object or the the underlying method. If this fails, we return GET.
        const extractMethod = ( response ) => {
            try {
                return ( response.config.method );
            } catch ( error ) {
                return ( 'get' );
            }
        };

        return {
            'request': config => {
                // NOTE: We know that this config object will contain a method as
                // this is the definition of the interceptor - it must accept a
                // config object and return a config object.
                httpSnifferService.startRequest( config.method );
                // Pass-through original config object.
                return ( config );
            },
            'requestError': rejection => {
                // At this point, we don't why the outgoing request was rejected.
                // And, we may not have access to the config - the rejection may
                // be an error object. As such, we'll just track this request as
                // a 'GET'.
                // --
                // NOTE: We can't ignore this one since our responseError() would
                // pick it up and we need to be able to even-out our counts.
                httpSnifferService.startRequest( 'get' );
                return ( Promise.reject( rejection ) );
            },
            'response': response => {
                httpSnifferService.endRequest( extractMethod( response ) );
                return ( response );
            },
            'responseError': response => {
                httpSnifferService.endRequest( extractMethod( response ) );

                return ( Promise.reject( response ) );
            }
        };
    };
    $httpProvider.interceptors.push( [ 'httpSnifferService', httpTrafficInterceptor ] );
};

httpTrafficInterceptorConfig.$inject = [ '$httpProvider' ];

 export default httpTrafficInterceptorConfig;