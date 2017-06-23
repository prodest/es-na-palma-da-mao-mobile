/* tslint:disable:no-unused-expression */

let httpTimeoutInterceptorConfig = $httpProvider => {

    const TIMEOUT = 30000;

    let httpTimeoutInterceptor = () => {
        return {
            'request': config => {

                config.timeout = config.timeout || TIMEOUT;
                config.startTime = new Date().getTime();

                // Pass-through original config object.
                return ( config );
            }
        };
    };
    $httpProvider.interceptors.push( [ httpTimeoutInterceptor ] );
};

httpTimeoutInterceptorConfig.$inject = [ '$httpProvider' ];

export default httpTimeoutInterceptorConfig;