import { IHttpService } from 'angular';
import { Push, AndroidPushOptions, IOSPushOptions, PushNotification, Device } from 'ionic-native';

import { ISettings } from '../settings/index';
import { PushUser } from './models/index';
import { TransitionService } from '../transition.service';

export class PushService {

    public static $inject: string[] = [
        '$http',
        'settings',
        'transitionService'
    ];

    constructor( private $http: IHttpService,
        private settings: ISettings,
        private transitionService: TransitionService ) {
    }

    public init() {
        let androidPushConfig: AndroidPushOptions = {
            senderID: this.settings.push.senderId,
            forceShow: this.settings.push.forceShow,
            icon: this.settings.push.defaultIcon,
            iconColor: this.settings.push.defaultColor
        };

        let iosPushConfig: IOSPushOptions = {
            senderID: this.settings.push.senderId,
            alert: this.settings.push.alert,
            badge: this.settings.push.badge,
            sound: this.settings.push.sound,
            gcmSandbox: this.settings.push.gcmSandbox
        };

        let push: PushNotification = Push.init( { android: androidPushConfig, ios: iosPushConfig });

        if ( push.on ) {
            push.on( 'registration', ( data ) => {
                this.registerUser( data.registrationId );
            });

            push.on( 'notification', ( data ) => {
                this.notify( data.additionalData );
            });

            // TODO: send statistics to answers
            // push.on( 'error', ( e ) => console.log( e ) );
        }
    }

    /**
     * 
     * 
     * @param {string} registrationId
     * 
     * @memberOf PushService
     */
    public registerUser( registrationId: string ) {
        this.$http.post( `${this.settings.api.push}/subscribe`, this.getPushUser( registrationId ), { headers: { 'Transparent': true } });
    }

    /**
     * 
     * 
     * 
     * @memberOf PushService
     */
    public unregisterUser( timeout?: number ) {
        this.$http.post( `${this.settings.api.push}/unsubscribe`, this.getPushUser(), { timeout: timeout, headers: { 'Transparent': true } });
    }

    /**
     * 
     * 
     * @param {*} data
     */
    public notify( data: any ): void {
        if ( data.appData && data.appData.state ) {
            this.transitionService.changeState( data.appDatta.state, data.appData.params, {}, { root: true, reload: true });
        }
    }

    /* Private */

    /**
     * 
     * 
     * @private
     * @param {string} [registrationId]
     * @returns
     * 
     * @memberOf PushService
     */
    private getPushUser( registrationId?: string ) {
        let pushUser: PushUser = { user: Device.device.uuid, secret: this.settings.push.secret };

        if ( registrationId ) {
            pushUser.type = ionic.Platform.platform();
            pushUser.token = registrationId;
        }
        return pushUser;
    }
}
