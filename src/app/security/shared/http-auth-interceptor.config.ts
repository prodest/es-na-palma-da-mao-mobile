import { TransitionService } from './../../shared/shared.module';
import { AuthenticationService } from './index';

let httpAuthInterceptorConfig = $httpProvider => {

    let authInterceptor = ( $injector: any ) => {

        // Add Bearer token Authorization header to the config (request object)
        let addAuthorizationHeader = ( config, accessToken ) => {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
            return config;
        };

        return {
            request: async ( config ) => {

                // ref: http://stackoverflow.com/questions/20230691/injecting-state-ui-router-into-http-interceptor-causes-circular-dependency
                const authenticationService = $injector.get( 'authenticationService' ) as AuthenticationService;

                if ( config.headers[ 'Send-Authorization' ] && config.headers[ 'Send-Authorization' ] === 'no' ) {
                    return config;
                }

                try {
                    // sempre tenta manter o usuário logado gerando um novo access token caso o mesmo tenha expirado.   
                    const accessToken = await authenticationService.refreshAccessTokenIfNeeded();
                    return addAuthorizationHeader( config, accessToken );

                } catch ( error ) {
                    if ( error.message === 'no-token' ) {
                        return config;
                    }
                    throw error;
                };
            },

            // on http Error
            responseError: ( rejection ) => {

                const transitionService: TransitionService = $injector.get( 'transitionService' );
                const authenticationService: AuthenticationService = $injector.get( 'authenticationService' );

                // A api retorna 498 caso a validação no acesso cidadão tenha falhado 
                if ( rejection.status === 498 ) {
                    authenticationService.logout(() => transitionService.changeState( 'home' ) );
                }
                return Promise.reject( rejection );
            }
        };
    };

    $httpProvider.interceptors.push( [ '$injector', authInterceptor ] );
};

httpAuthInterceptorConfig.$inject = [ '$httpProvider' ];

export default httpAuthInterceptorConfig;
