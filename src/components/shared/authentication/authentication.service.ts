import { GooglePlus, Facebook, FacebookLoginResponse } from 'ionic-native';
import { AnswersService } from '../fabric/index';
import { AuthenticationStorageService } from './authentication-storage.service';
import { AcessoCidadaoService } from './acesso-cidadao.service';
import { DigitsService } from './digits.service';
import {
    AcessoCidadaoIdentity,
    SocialNetworkIdentity,
    PhoneIdentity,
    DigitsAuthResponse,
    GoogleAuthResponse,
    AcessoCidadaoClaims,
    Token
} from './models/index';
import { ISettings } from '../settings/index';

/**
 * Facade de autenticação consumido por toda a aplicação
 * 
 * @export
 * @class AuthenticationService
 */
export class AuthenticationService {

    public static $inject: string[] = [
        'authenticationStorageService',
        'answersService',
        'acessoCidadaoService',
        'digitsService',
        'settings'
    ];


    /**
     * Creates an instance of AuthenticationService.
     * 
     * @param {AuthenticationStorageService} authenticationStorageService
     * @param {AnswersService} answersService
     * @param {AcessoCidadaoService} acessoCidadaoService
     * @param {DigitsService} digitsService
     * @param {ISettings} settings
     * 
     * @memberOf AuthenticationService
     */
    constructor( private authenticationStorageService: AuthenticationStorageService,
        private answersService: AnswersService,
        private acessoCidadaoService: AcessoCidadaoService,
        private digitsService: DigitsService,
        private settings: ISettings ) {
        this.activate();
    }


    /**
     * 
     * 
     * 
     * @memberOf AuthenticationService
     */
    public activate(): void {
        this.acessoCidadaoService.initialize( this.settings.identityServer.url );
    }

    /**
     * 
     * 
     * @param {string} username
     * @param {string} password
     * @returns {Promise<AcessoCidadaoClaims>}
     * 
     * @memberOf AuthenticationService
     */
    public acessoCidadaoLogin( username: string, password: string ): Promise<AcessoCidadaoClaims> {

        let identity: AcessoCidadaoIdentity = {
            client_id: this.settings.identityServer.clients.espm.id,
            client_secret: this.settings.identityServer.clients.espm.secret,
            grant_type: 'password',
            scope: this.settings.identityServer.defaultScopes,
            username: username,
            password: password
        };

        return this.acessoCidadaoService.login( identity );
    }


    /**
     * 
     * 
     * @param {*} success
     * @returns {void}
     */
    public logout( success: any ): void {
        Facebook.logout();
        GooglePlus.logout();
        this.digitsService.logout(); // TODO: Verificar se precisa mesmo do logout do Digits
        this.acessoCidadaoService.logout( success );
    }

    /**
     * Realiza o login usando o facebook
     * https://github.com/jeduan/cordova-plugin-facebook4
     * 
     * @returns {Promise<AcessoCidadaoClaims>}
     * 
     * @memberOf AuthenticationService
     */
    public async facebookLogin(): Promise<AcessoCidadaoClaims> {

        let identity: SocialNetworkIdentity;

        try {
            // autentica no faceboook provider
            const loginResponse: FacebookLoginResponse = await Facebook.login( [ 'email', 'public_profile' ] );

            // salva resposta no local storage
            this.authenticationStorageService.facebookAuthResponse = loginResponse;

            // efetua log
            this.answersService.sendLogin( 'Facebook', true, undefined );

            identity = {
                client_id: this.settings.identityServer.clients.espmExternalLoginAndroid.id,
                client_secret: this.settings.identityServer.clients.espmExternalLoginAndroid.secret,
                grant_type: 'customloginexterno',
                scope: this.settings.identityServer.defaultScopes,
                provider: 'Facebook',
                accesstoken: loginResponse.authResponse.accessToken
            };
        } catch ( error ) {
            this.answersService.sendLogin( 'Facebook', false, undefined );
            throw error;
        }

        return this.acessoCidadaoService.login( identity );
    }

    /**
     * Realiza o login usando conta do google
     * 
     * @returns {Promise<AcessoCidadaoClaims>}
     * 
     * @memberOf AuthenticationService
     */
    public async googleLogin(): Promise<AcessoCidadaoClaims> {

        let identity: SocialNetworkIdentity;

        try {

            let options = {
                scopes: 'profile email', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
                webClientId: this.settings.googleWebClientId, // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
                offline: true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
            };

            // autentica no google provider
            const authReponse: GoogleAuthResponse = await GooglePlus.login( options );

            // salva resposta no local storage
            this.authenticationStorageService.googleAuthResponse = authReponse;

            // efetua log
            this.answersService.sendLogin( 'Google', true, undefined );

            identity = {
                client_id: this.settings.identityServer.clients.espmExternalLoginAndroid.id,
                client_secret: this.settings.identityServer.clients.espmExternalLoginAndroid.secret,
                grant_type: 'customloginexterno',
                scope: this.settings.identityServer.defaultScopes,
                provider: 'Google',
                accesstoken: authReponse.idToken
            };
        } catch ( error ) {
            this.answersService.sendLogin( 'Google', false, undefined );
            throw error;
        }

        return this.acessoCidadaoService.login( identity );
    }

    /**
     * 
     * 
     * @returns {Promise<AcessoCidadaoClaims>}
     * 
     * @memberOf AuthenticationService
     */
    public async digitsLogin(): Promise<AcessoCidadaoClaims> {

        const authResponse: DigitsAuthResponse = await this.digitsService.login( {});

        let identity: PhoneIdentity = {
            client_id: this.settings.identityServer.clients.espmExternalLoginAndroid.id,
            client_secret: this.settings.identityServer.clients.espmExternalLoginAndroid.secret,
            grant_type: 'customloginexterno',
            scope: this.settings.identityServer.defaultScopes,
            provider: 'Celular',
            accesstoken: 'token',
            apiUrl: authResponse[ 'X-Auth-Service-Provider' ],
            authHeader: authResponse[ 'X-Verify-Credentials-Authorization' ]
        };

        return this.acessoCidadaoService.login( identity );
    }

    /**
     * 
     * 
     * @returns {Promise<{}>}
     */
    public refreshTokenIfNeeded(): Promise<Token> {
        return this.acessoCidadaoService.refreshTokenIfNeeded();
    }


    /**
     * 
     * 
     * @returns {Boolean}
     */
    public get isAuthenticated(): boolean {
        return this.acessoCidadaoService.authenticated;
    }

    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     */
    public get user(): AcessoCidadaoClaims {
        return this.acessoCidadaoService.userClaims;
    }

    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     * @memberOf AuthenticationService
     */
    public get hasToken(): boolean {
        return !!this.acessoCidadaoService.token && !!this.acessoCidadaoService.tokenClaims;
    }

    /**
     * 
     * @memberOf AuthenticationService
     */
    public set anonymousLogin( value: boolean ) {
        this.authenticationStorageService.anonymousLogin = value;
    }

    /**
     * 
     * @memberOf AuthenticationService
     */
    public get anonymousLogin() {
        return this.authenticationStorageService.anonymousLogin;
    }
}
