import { Network, Diagnostic } from 'ionic-native';
import { ToastService } from './toast/index';

/**
 * 
 * 
 * @param {ionic.platform.IonicPlatformService} $ionicPlatform
 * @param {ToastService} toast
 */
function run( $ionicPlatform: ionic.platform.IonicPlatformService, toast: ToastService ) {

    const showNetworkSettings = () => {
        if ( Diagnostic.switchToWifiSettings ) {
            Diagnostic.switchToWifiSettings();
        } else {
            Diagnostic.switchToSettings();
        }
    };

    const notifyOfflineState = () => {
        toast.showActionToast( { message: 'Você está offline', action: 'Configurações', hideDelay: 0 })
            .then( action => {
                if ( action === 'ok' ) {
                    showNetworkSettings();
                }
            });
    };

    const notifyOnlineState = () => {
        toast.hide();
        // We just got a connection but we need to wait briefly
        // before we determine the connection type.  Might need to wait
        // prior to doing any api requests as well.
        setTimeout(() => {
            toast.showActionToast( { message: `Você está online (${Network.connection})`, action: 'Ok', hideDelay: 3000 });
        }, 3000 );
    };

    // On device ready
    $ionicPlatform.ready(() => {
        Network.onDisconnect().subscribe( notifyOfflineState );
        Network.onConnect().subscribe( notifyOnlineState );

        if ( Network.connection === 'none' ) {
            notifyOfflineState();
        }
    });
}

run.$inject = [ '$ionicPlatform', 'toast' ];

export default run;

