import * as moment from 'moment';
import { Keyboard } from 'ionic-native';
import { HttpSnifferService, HttpErrorSnifferService } from './http/index';
import { ISettings } from './settings/index';
import { CordovaPermissions } from './permissions/index';

/**
 * 
 * 
 * @param {*} $rootScope
 * @param {ionic.platform.IonicPlatformService} $ionicPlatform
 * @param {HttpSnifferService} httpSnifferService
 * @param {HttpErrorSnifferService} httpErrorSnifferService
 * @param {ISettings} settings
 * @param {CordovaPermissions} cordovaPermissions
 */
function appRun( $rootScope: any,
    $ionicPlatform: ionic.platform.IonicPlatformService,
    httpSnifferService: HttpSnifferService,
    httpErrorSnifferService: HttpErrorSnifferService,
    settings: ISettings,
    cordovaPermissions: CordovaPermissions ) {

    $ionicPlatform.ready( async () => {
        // configura locale do moment
        moment.locale( settings.locale );

        // configura rootScope
        $rootScope.isAndroid = ionic.Platform.isAndroid();  // Check platform of running device is android or not.
        $rootScope.isIOS = ionic.Platform.isIOS();          // Check platform of running device is ios or not.
        $rootScope.uiState = {
            loading: false,
            pendingRequests: 0,
            error: undefined
        };

        // We can now watch the trafficCop service to see when there are pending
        // HTTP requests that we're waiting for.
        let rootWatch = $rootScope.$watch( () => {
            $rootScope.uiState.pendingRequests = httpSnifferService.pending.all;
            $rootScope.uiState.loading = $rootScope.uiState.pendingRequests > 0;
            $rootScope.uiState.error = httpErrorSnifferService.error;
        } );

        $rootScope.$on( '$ionicView.beforeEnter', () => {
            httpErrorSnifferService.error = undefined;
        });

        // here is where the cleanup happens
        $rootScope.$on( '$destroy', () => rootWatch() );

        Keyboard.hideKeyboardAccessoryBar( true );
        Keyboard.disableScroll( true );
        Keyboard.onKeyboardShow().subscribe(() => {
            document.body.classList.add( 'keyboard-openned' );
        });

        Keyboard.onKeyboardHide().subscribe(() => {
            document.body.classList.remove( 'keyboard-openned' );
        });
        

        // Check coarse location permissions
        cordovaPermissions.RequestCoarseLocationPermission();
    });
}

appRun.$inject = [
    '$rootScope',
    '$ionicPlatform',
    'httpSnifferService',
    'httpErrorSnifferService',
    'settings',
    'cordovaPermissions'
];

export default appRun;
