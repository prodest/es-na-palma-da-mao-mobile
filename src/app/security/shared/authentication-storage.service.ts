import { AcessoCidadaoClaims, User } from './models/index';
import { AcessoCidadaoResponse, GoogleAuthResponse, AccessTokenClaims } from './models/index';
import { FacebookLoginResponse } from 'ionic-native';

/**
 * Serviço que trata local storage no contexto da autenticação
 * 
 * @export
 * @class AuthenticationStorageService
 */
export class AuthenticationStorageService {

    public static $inject: string[] = [ '$localStorage' ];

    /**
     * Creates an instance of AuthenticationStorageService.
     * 
     * @param {*} $localStorage
     * 
     * @memberOf AuthenticationStorageService
     */
    constructor( private $localStorage: any ) { }

    /**
     * 
     * 
     * 
     * @memberOf AuthenticationStorageService
     */
    public reset(): void {
        this.$localStorage.$reset();
    }


    /**
     * 
     * 
     * @type {User}
     * @memberOf AuthenticationStorageService
     */
    public get user(): User {

        // user sempre deve existir: Null Object pattern
        if ( !this.$localStorage.user ) {
            this.$localStorage.user = User.createNullUser();
        }

        return this.$localStorage.user;
    }


    /**
     * 
     * 
     * 
     * @memberOf AuthenticationStorageService
     */
    public set user( user: User ) {
        this.$localStorage.user = user;
    }

    /**
     * 
     * 
     * @readonly
     * 
     * @memberOf AuthenticationStorageService
     */
    public get externalProviderAvatarUrl() {
        if ( angular.isDefined( this.googleAuthResponse ) ) {
            return this.googleAuthResponse.imageUrl;
        }
        if ( angular.isDefined( this.facebookAuthResponse ) ) {
            return `https://graph.facebook.com/v2.7/${this.facebookAuthResponse.authResponse.userID}/picture?type=normal`;
        }
    }

    /************************************** Acesso Cidadão **************************************/


    /**
     * 
     * 
     * @type {AcessoCidadaoResponse}
     * @memberOf AuthenticationStorageService
     */
    public get acessoCidadaoResponse(): AcessoCidadaoResponse {
        return this.$localStorage.acessoCidadaoResponse;
    }


    /**
     * 
     * 
     * 
     * @memberOf AuthenticationStorageService
     */
    public set acessoCidadaoResponse( acessoCidadaoResponse: AcessoCidadaoResponse ) {
        this.$localStorage.acessoCidadaoResponse = acessoCidadaoResponse;
    }


    /**
     * 
     * 
     * @type {(AccessTokenClaims )}
     * @memberOf AuthenticationStorageService
     */
    public get accessTokenClaims(): AccessTokenClaims {
        return this.$localStorage.accessTokenClaims;
    }


    /**
     * 
     * 
     * 
     * @memberOf AuthenticationStorageService
     */
    public set accessTokenClaims( accessTokenClaims: AccessTokenClaims ) {
        this.$localStorage.accessTokenClaims = accessTokenClaims;
    }


    /**
     * 
     * 
     * @type {AcessoCidadaoClaims}
     * @memberOf AuthenticationStorageService
     */
    public get acessoCidadaoClaims(): AcessoCidadaoClaims {
        return this.$localStorage.acessoCidadaoClaims;
    }


    /**
     * 
     * 
     * 
     * @memberOf AuthenticationStorageService
     */
    public set acessoCidadaoClaims( acessoCidadaoClaims: AcessoCidadaoClaims ) {
        this.$localStorage.acessoCidadaoClaims = acessoCidadaoClaims;
    }

    /**
     * 
     * 
     * @readonly
     * @type {(number | undefined)}
     * @memberOf AuthenticationStorageService
     */
    public get tokenSub(): number | undefined {
        if ( !angular.isDefined( this.$localStorage.accessTokenClaims ) ) {
            return undefined;
        }
        return this.$localStorage.accessTokenClaims.sub;
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
}
