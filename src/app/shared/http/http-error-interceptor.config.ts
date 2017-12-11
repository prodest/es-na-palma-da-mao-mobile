import { HttpErrorSnifferService } from './http-error-sniffer.service';
import { Error } from './models/index';

let httpErrorInterceptorConfig = $httpProvider => {
    let httpErrorInterceptor = ( $log, httpErrorSnifferService: HttpErrorSnifferService ) => {
        return {
            'response': function ( response ) {
                httpErrorSnifferService.error = undefined;
                return ( response );
            },
            'responseError': function ( response ) {
                const error: Error = angular.merge( {
                    status: response.status,
                    error: 'Erro inesperado',
                    message: 'Erro inesperado'
                }, response.data || {});


                const respTime = new Date().getTime() - response.config.startTime;

                error.isTimeout = ( response.status === -1 && response.config.timeout && respTime >= response.config.timeout ); 

                httpErrorSnifferService.error = error;

                $log.error( response );
                return Promise.reject( response );
            }
        };
    };
    $httpProvider.interceptors.push( [ '$log', 'httpErrorSnifferService', httpErrorInterceptor ] );
};

httpErrorInterceptorConfig.$inject = [ '$httpProvider' ];

export default httpErrorInterceptorConfig;