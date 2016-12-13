import { Identity } from './models/identities/identity';
import { GooglePlus, Facebook, FacebookLoginResponse } from 'ionic-native';
import { AuthenticationStorageService } from './authentication-storage.service';
import { AcessoCidadaoService } from './acesso-cidadao.service';
import { DigitsService } from './digits.service';
import { ISettings, AnswersService, PushService } from '../../shared/shared.module';

import {
    AcessoCidadaoIdentity,
    SocialNetworkIdentity,
    PhoneIdentity,
    DigitsAuthResponse,
    GoogleAuthResponse,
    User
} from './models/index';


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
        'settings',
        'pushService'
    ];


    /**
     * Creates an instance of AuthenticationService.
     * 
     * @param {AuthenticationStorageService} authStorage
     * @param {AnswersService} answersService
     * @param {AcessoCidadaoService} acessoCidadaoService
     * @param {DigitsService} digitsService
     * @param {ISettings} settings
     * @param {PushService} pushService
     * 
     * @memberOf AuthenticationService
     */
    constructor( private authStorage: AuthenticationStorageService,
        private answersService: AnswersService,
        private acessoCidadaoService: AcessoCidadaoService,
        private digitsService: DigitsService,
        private settings: ISettings,
        private pushService: PushService ) {
    }

    /**
     * 
     * 
     * @param {*} success
     * @returns {void}
     */
    public async logout( success: Function ) {

        // 1 - Remove o registro do Push
        await this.pushService.unregisterUser();

        // 2 - se desloga de todos os providers
        GooglePlus.logout();
        this.digitsService.logout();
        this.acessoCidadaoService.logout();

        // 3 - limpa auth storage
        this.authStorage.reset();

        // 4 - Reinicia o push para usuário anônimo
        this.pushService.init();

        success();
    }


    /**
     * 
     * 
     * @param {string} username
     * @param {string} password
     * @returns {Promise<User>}
     * 
     * @memberOf AuthenticationService
     */
    public acessoCidadaoLogin( username: string, password: string ): Promise<User> {

        let identity: AcessoCidadaoIdentity = {
            client_id: this.settings.identityServer.clients.espm.id,
            client_secret: this.settings.identityServer.clients.espm.secret,
            grant_type: 'password',
            scope: this.settings.identityServer.defaultScopes,
            username: username,
            password: password
        };

        return this.login( identity );
    }

    /**
     * Realiza o login usando o facebook
     * https://github.com/jeduan/cordova-plugin-facebook4
     * 
     * @returns {Promise<User>}
     * 
     * @memberOf AuthenticationService
     */
    public async facebookLogin(): Promise<User> {

        let identity: SocialNetworkIdentity;

        try {
            // autentica no faceboook provider
            const loginResponse: FacebookLoginResponse = await Facebook.login( [ 'email', 'public_profile' ] );

            // salva resposta no local storage
            this.authStorage.facebookAuthResponse = loginResponse;

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

        return this.login( identity );
    }

    /**
     * Realiza o login usando conta do google
     * 
     * @returns {Promise<User>}
     * 
     * @memberOf AuthenticationService
     */
    public async googleLogin(): Promise<User> {

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
            this.authStorage.googleAuthResponse = authReponse;

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

        return this.login( identity );
    }

    /**
     * 
     * 
     * @returns {Promise<User>}
     * 
     * @memberOf AuthenticationService
     */
    public async digitsLogin(): Promise<User> {

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

        return this.login( identity );
    }

    /**
     * 
     * 
     * @returns {Promise<{}>}
     */
    public refreshAccessTokenIfNeeded(): Promise<string> {
        return this.acessoCidadaoService.refreshAccessTokenIfNeeded();
    }

    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     */
    public get user(): User {
        // sempre refaz o calculo para saber se o token expirou. Atribui o resultado
        // na propriedade isAuthenticated (atualiza valor no storage).
        this.authStorage.user.isAuthenticated = this.acessoCidadaoService.authenticated;
        return this.authStorage.user;
    }


    /************************************* Private API *************************************/


    /**
     * 
     * 
     * @private
     * @param {Identity} identity
     * @returns {Promise<User>}
     * 
     * @memberOf AuthenticationService
     */
    private async login( identity: Identity ): Promise<User> {

        // 1) Efetua login e obtém as claims de usuário do acesso cidadão
        // 2) Cria uma usuário com os dados das claims + informações extras ( avatarUrl, anonymous, isAuthenticated ...)
        // 3) Se o login foi via provider externo (google, facebook), tenta buscar a url do avatar do provider. Usa padrão como fallback
        // 4) Salva o usuário no local storage. 
        // 5) Reinicia o serviço de push

        // 1)
        const claims = await this.acessoCidadaoService.login( identity );

        // 2)
        const user = User.createFrom( claims );

        // 3)
        user.avatarUrl = this.authStorage.externalProviderAvatarUrl || user.avatarUrl;

        // 4)
        this.authStorage.user = user;

        // 5)
        this.pushService.init();

        return user;
    }
}
