import { AuthenticationService, Token } from '../authentication/index';
import { IQService } from 'angular';

let httpInterceptorsConfig = $httpProvider => {

    let authorizationInterceptor = ( $q: IQService, $injector: any ) => {

        // Add Bearer token Authorization header to the config (request object)
        let addAuthorizationHeader = ( config, token ) => {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        };

        return {
            'request': ( config ) => {

                // ref: http://stackoverflow.com/questions/20230691/injecting-state-ui-router-into-http-interceptor-causes-circular-dependency
                const authenticationService = $injector.get( 'authenticationService' ) as AuthenticationService;

                if ( config.headers[ 'Send-Authorization' ] && config.headers[ 'Send-Authorization' ] === 'no' ) {
                    return config;
                }

                // sempre tenta manter o usuário logado gerando um novo access token caso o mesmo tenha expirado.   
                return authenticationService.refreshTokenIfNeeded()
                    .then(( token: Token ) => {
                        return addAuthorizationHeader( config, token.access_token );
                    })
                    .catch( error => {
                        if ( error.message === 'no-token' ) {
                            return config;
                        }
                        throw error;
                    });
            },
            'responseError': ( rejection ) => {

                const $state = $injector.get( '$state' ) as angular.ui.IStateService;
                const authenticationService = $injector.get( 'authenticationService' ) as AuthenticationService;

                // A api retorna 498 caso a validação no acesso cidadão tenha falhado 
                if ( rejection.status === 498 ) {
                    authenticationService.signOut(() => $state.go( 'home' ) );
                }
                return $q.reject( rejection );
            }
        };
    };

    $httpProvider.interceptors.push( [ '$q', '$injector', authorizationInterceptor ] );
};

httpInterceptorsConfig.$inject = [ '$httpProvider' ];

export default httpInterceptorsConfig;
