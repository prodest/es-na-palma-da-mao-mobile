import { GoogleAuthResponse } from './models/index';
import { FacebookLoginResponse } from 'ionic-native';

/**
 * Serviço que trata local storage no contexto da autenticação
 * 
 * @export
 * @class AuthenticationStorageService
 */
export class AuthenticationStorageService {

    public static $inject: string[] = [ '$localStorage' ];

    constructor( private $localStorage: any ) { }

    /************************************** Acesso Cidadão **************************************/

    /**
     * 
     * 
     * @readonly
     * @type {(number | undefined)}
     * @memberOf AuthenticationStorageService
     */
    public get tokenSub(): number | undefined {
        if ( !angular.isDefined( this.$localStorage.tokenClaims ) ) {
            return undefined;
        }
        return this.$localStorage.tokenClaims.sub;
    }



    /************************************** Google /**************************************/

    /**
     * 
     * 
     * @type {GoogleAuthResponse}
     * @memberOf AuthenticationStorageService
     */
    public get googleAuthResponse(): GoogleAuthResponse {
        return this.$localStorage.googleAuthResponse;
    }

    /**
     * 
     * 
     * 
     * @memberOf AuthenticationStorageService
     */
    public set googleAuthResponse( googleAuthResponse: GoogleAuthResponse ) {
        this.$localStorage.googleAuthResponse = googleAuthResponse;
    }

    /**
     * 
     * 
     * @readonly
     * 
     * @memberOf AuthenticationStorageService
     */
    public get googleAvatarUrl() {
        if ( angular.isDefined( this.$localStorage.googleAuthResponse ) ) {
            return this.$localStorage.googleAuthResponse.imageUrl;
        }
    }



    /************************************** Facebook **************************************/

    /**
     * 
     * 
     * @type {FacebookLoginResponse}
     * @memberOf AuthenticationStorageService
     */
    public get facebookAuthResponse(): FacebookLoginResponse {
        return this.$localStorage.facebookAuthResponse;
    }

    /**
     * 
     * 
     * 
     * @memberOf AuthenticationStorageService
     */
    public set facebookAuthResponse( facebookAuthResponse: FacebookLoginResponse ) {
        this.$localStorage.facebookAuthResponse = facebookAuthResponse;
    }

    /**
     * 
     * 
     * @readonly
     * 
     * @memberOf AuthenticationStorageService
     */
    public get facebookAvatarUrl() {
        if ( angular.isDefined( this.facebookAuthResponse ) ) {
            return `https://graph.facebook.com/v2.7/${this.facebookAuthResponse.authResponse.userID}/picture?type=normal`;
        }
    }



    /*************************************** Anonymous **************************************/

    /**
     * 
     * 
     * @type {boolean}
     * @memberOf AuthenticationStorageService
     */
    public get anonymousLogin(): boolean {
        return this.$localStorage.anonymousLogin;
    }

    /**
     * 
     * 
     * 
     * @memberOf AuthenticationStorageService
     */
    public set anonymousLogin( value: boolean ) {
        this.$localStorage.anonymousLogin = value;
    }
}
