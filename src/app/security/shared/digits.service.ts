import { IWindowService } from 'angular';

import { DigitsAccessToken, DigitsAuthResponse  } from './models/index';
import { AnswersService } from '../../shared/shared.module';

/**
 * https://github.com/JimmyMakesThings/cordova-plugin-digits
 */
export class DigitsService {

    public static $inject: string[] = [ '$window', '$localStorage', 'answersService' ];

    /**
     * Creates an instance of DigitsService.
     * 
     * @param {IWindowService} $window
     * @param {*} $localStorage
     * @param {AnswersService} answersService
     * 
     * @memberOf DigitsService
     */
    constructor( private $window: IWindowService,
        private $localStorage: any,
        private answersService: AnswersService ) {
    }

    /**
     * 
     * 
     * @param {*} options
     * @returns {Promise<DigitsAuthResponse>}
     * 
     * @memberOf DigitsService
     */
    public login( options: any ): Promise<DigitsAuthResponse> {

        let defaultOptions = {
            accentColor: '#ff0000',
            backgroundColor: '#ffffff'
        };

        options = angular.extend( options, defaultOptions );

        /**
         * Exemplo de objeto retornado pelo digits
         *
         *  {
                X-Auth-Service-Provider: "https://api.digits.com/1.1/sdk/account.json"
                X-Verify-Credentials-Authorization: "OAuth oauth_consumer_key="mtlaFB935auxWWNfPv6TZGK87",
                                                     oauth_nonce="1343188175196443787286983593339452",
                                                     oauth_signature="5V%2BhB6CmUNYMCCigaRPNBCoASvw%3D",
                                                     oauth_signature_method="HMAC-SHA1",
                                                     oauth_timestamp="1464901453",
                                                     oauth_token="3319052116-Qp7NfLhxMtKV2AnxygthRPV3xB0UgorOdMhxAas",
                                                     oauth_version="1.0""
            }
         */
        return new Promise(( resolve, reject ) => {
            this.$window.plugins.digits.authenticate( options, ( authResponse: DigitsAuthResponse ) => {
                this.$localStorage.digitsAuthResponse = this.buildAccessToken( authResponse );
                this.answersService.sendLogin( 'Digits', true, undefined );
                resolve( authResponse );
            }, errorDigits => {
                this.answersService.sendLogin( 'Digits', false, undefined );
                reject( errorDigits );
            });
        });
    }

    /**
     * 
     * 
     * 
     * @memberOf DigitsService
     */
    public logout(): void {
        if ( this.$window.plugins && this.$window.plugins.digits ) {
            delete this.$localStorage.digitsAuthResponse;
            this.$window.plugins.digits.logout();
        }
    }

    /**
     * 
     * 
     * @protected
     * @param {DigitsAuthResponse} authResponse
     * @returns {DigitsAccessToken}
     * 
     * @memberOf DigitsService
     */
    protected buildAccessToken( authResponse: DigitsAuthResponse ): DigitsAccessToken {
        let digitsAccessToken = {};
        authResponse[ 'X-Verify-Credentials-Authorization' ].split( ',' ).forEach(( item ) => {
            let aux = item.split( '=' );
            digitsAccessToken[ aux[ 0 ] ] = aux[ 1 ].substring( 1, aux[ 1 ].length - 1 );
        });
        return digitsAccessToken as DigitsAccessToken;
    }
}
