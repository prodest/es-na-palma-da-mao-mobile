import { GoogleAuthResponse } from './models/index';
import { FacebookLoginResponse } from 'ionic-native';

/**
 * Serviço que trata local storage no contexto do detran
 * 
 * @export
 * @class DetranStorage
 * @implements {DriverLicenseStorage}
 * @implements {VehicleStorage}
 */
export class AuthenticationStorageService {

    public static $inject: string[] = [ '$localStorage' ];

    constructor( private $localStorage: any ) {
    }

    /** Acesso Cidadão */

    public get tokenSub(): number | undefined {
        if ( !angular.isDefined( this.$localStorage.tokenClaims ) ) {
            return undefined;
        }
        return this.$localStorage.tokenClaims.sub;
    }

    /** Google */

    public get googleAuthResponse(): GoogleAuthResponse {
        return this.$localStorage.googleAuthResponse;
    }

    public set googleAuthResponse( googleAuthResponse: GoogleAuthResponse ) {
        this.$localStorage.googleAuthResponse = googleAuthResponse;
    }

    public get googleAvatarUrl() {
        if ( angular.isDefined( this.$localStorage.googleAuthResponse ) ) {
            return this.$localStorage.googleAuthResponse.imageUrl;
        }
    }

    /** Facebook */

    public get facebookAuthResponse(): FacebookLoginResponse {
        return this.$localStorage.facebookAuthResponse;
    }

    public set facebookAuthResponse( facebookAuthResponse: FacebookLoginResponse ) {
        this.$localStorage.facebookAuthResponse = facebookAuthResponse;
    }

    public get facebookAvatarUrl() {
        if ( angular.isDefined( this.facebookAuthResponse ) ) {
            return `https://graph.facebook.com/v2.7/${this.facebookAuthResponse.authResponse.userID}/picture?type=normal`;
        }
    }

    /** Anonymous */

    public get anonymousLogin(): boolean {
        return this.$localStorage.anonymousLogin;
    }

    public set anonymousLogin( value: boolean ) {
        this.$localStorage.anonymousLogin = value;
    }
}
