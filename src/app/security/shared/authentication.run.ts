import { Splashscreen } from 'ionic-native';
import { AuthenticationService } from './authentication.service';
import { PushService, TransitionService, statesJson } from '../../shared/shared.module';


function authRun(
    $rootScope: any,
    $ionicPlatform: ionic.platform.IonicPlatformService,
    authenticationService: AuthenticationService,
    pushService: PushService,
    transitionService: TransitionService ) {


    // Check unautorized access and redirect to home if it's the case
    $rootScope.$on( '$stateChangeStart', ( event, toState, toParams, fromState, fromParams, options ) => {

        let nextMenuState = statesJson.filter( state => state.name === toState.name );

        if ( !authenticationService.user.isAuthenticated && nextMenuState.length === 1 && nextMenuState[ 0 ].secure ) {
            event.preventDefault();
            transitionService.changeRootState( 'home' );
        }
    });

    $ionicPlatform.ready( async () => {
        await resumeApplication( 'app.transparency.dashboard' );
    });

    $ionicPlatform.on( 'resume', async () => {
        await resumeApplication();
    });

    /**
     * 
     */
    async function resumeApplication( redirectTo?: string ) {
        try {
            // pushService.init();

            if ( !authenticationService.user.anonymous ) {
                await authenticationService.refreshAccessTokenIfNeeded();
            }

            if ( redirectTo ) {
                transitionService.changeRootState( redirectTo );
            }
        }
        catch ( error ) {
            authenticationService.logout(() => transitionService.changeRootState( 'home' ) );
        }
        finally {
            Splashscreen.hide();
        }
    }
}

authRun.$inject = [
    '$rootScope',
    '$ionicPlatform',
    'authenticationService',
    'pushService',
    'transitionService'
];

export default authRun;
