let httpDelayInterceptorConfig = $httpProvider => {
    let httpDelayInterceptor = ( $timeout ) => {
        return {
            'response': ( response ) => {
                return $timeout( () => {
                    return response;
                }, 2500 );
            }
        };
    };
    $httpProvider.interceptors.push( [ '$timeout', httpDelayInterceptor ] );
};

httpDelayInterceptorConfig.$inject = [ '$httpProvider' ];

export default httpDelayInterceptorConfig;