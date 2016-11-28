import { LoginComponent } from './login/login.component';
import { NoAccessComponent } from './no-access/no-access.component';
import {
    AuthenticationService,
    AuthenticationStorageService,
    AcessoCidadaoService,
    DigitsService,
    httpAuthInterceptorConfig,
    authenticationRun
} from './shared/index';

export default angular.module( 'security.module', [] )

    // services
    .service( 'acessoCidadaoService', AcessoCidadaoService )
    .service( 'digitsService', DigitsService )
    .service( 'authenticationService', AuthenticationService )
    .service( 'authenticationStorageService', AuthenticationStorageService )

    // components
    .directive( 'login', LoginComponent )
    .directive( 'noAccess', NoAccessComponent )

    // config
    .config( httpAuthInterceptorConfig )

    // run
    .run( authenticationRun )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'login', {
                    url: 'login',
                    template: '<login></login>'
                })
                .state( 'app.noAccess', {
                    url: 'noAccess',
                    views: {
                        content: {
                            template: '<no-access></no-access>'
                        }
                    }
                });
        }
    ] ).name;

export { User, AuthenticationService } from './shared/index';
