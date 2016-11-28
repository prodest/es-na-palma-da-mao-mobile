import { AuthenticationStorageService } from './authentication-storage.service';
import { ISettings, AnswersService } from '../../shared/shared.module';
import {
    IWindowService,
    IHttpService,
    IRequestConfig,
    IHttpPromiseCallbackArg
} from 'angular';
import {
    AcessoCidadaoResponse,
    AcessoCidadaoClaims,
    AccessTokenClaims,
    Identity,
    AcessoCidadaoIdentity
} from './models/index';


/**
 * Classe para autenticação usando IdentityServer3 no acessso cidadão
 * Centraliza acesso a token, claims e local-storage de autenticação
 * 
 * @export
 * @class AcessoCidadaoService
 */
export class AcessoCidadaoService {

    public static $inject: string[] = [ '$window', '$http', 'authenticationStorageService', 'settings', 'answersService' ];
    private identityServerUrl: string;
    private static refreshingToken: boolean = false;

    /**
     * Creates an instance of AcessoCidadaoService.
     * 
     * @param {IWindowService} $window
     * @param {IHttpService} $http
     * @param {AuthenticationStorageService} authStorage
     * @param {ISettings} settings
     * @param {AnswersService} answersService
     * 
     * @memberOf AcessoCidadaoService
     */
    constructor( private $window: IWindowService,
        private $http: IHttpService,
        private authStorage: AuthenticationStorageService,
        private settings: ISettings,
        private answersService: AnswersService ) {
        this.identityServerUrl = this.settings.identityServer.url;
    }

    /**
     * Verifica se o token não está expirado == usuário autenticado.
     * 
     * @readonly
     * @type {boolean}
     */
    public get authenticated(): boolean {
        return !!this.acessoCidadaoResponse && !this.tokenIsExpiredIn( new Date() );
    }

    /**
     * Autentica o usuário no acesso cidadão
     * 
     * @param {Identity} identity
     * @returns {Promise<AcessoCidadaoClaims>}
     */
    public async login( identity: Identity ): Promise<AcessoCidadaoClaims> {
        try {
            const token = await this.getToken( identity );
            this.sendAnswers( identity, true );
            this.saveTokenOnLocalStorage( token );
            return await this.getAcessoCidadaoUserClaims();
        } catch ( error ) {
            this.sendAnswers( identity, false );
            throw error;
        }
    }

    /**
     * Faz logout do usuário. Remove o token do localstore e os claims salvos.
     */
    public logout(): void {
        // todo
    }

    /**
     * Atualiza e retorna o access token quando necessário baseado em sua data de expiração.
     * 
     * @returns {Promise<string>} - Uma promise para o access token
     */
    public async refreshAccessTokenIfNeeded(): Promise<string> {

        let currentDate = new Date();

        if ( !this.accessTokenClaims || !this.acessoCidadaoResponse ) {
            return Promise.reject( { message: 'no-token' });
        }

        // Usa o token ainda válido e faz um refresh token em background (não-bloqueante)
        if ( this.tokenIsExpiringIn( currentDate ) ) {
            this.refreshAccessToken();
            return Promise.resolve( this.acessoCidadaoResponse.access_token );
        }

        // Faz um refresh token e espera pra retornar o novo token "refreshado"
        if ( this.tokenIsExpiredIn( currentDate ) ) {
            return await this.refreshAccessToken();
        }

        return Promise.resolve( this.acessoCidadaoResponse.access_token );
    }

    /**
     * Obtém as claims do usuário no acesso cidadão.
     * 
     * @returns
     */
    public getAcessoCidadaoUserClaims(): Promise<AcessoCidadaoClaims> {
        let userClaimsUrl = `${this.identityServerUrl}/connect/userinfo`;

        return this.$http.get( userClaimsUrl )
            .then(( response: IHttpPromiseCallbackArg<AcessoCidadaoClaims> ) => response.data );
    }




    /************************************* Private API *************************************/

    /**
     * Claims dos protocolos de autenticação utilizado.
     * 
     * @return {AccessTokenClaims}
     */
    private get accessTokenClaims(): AccessTokenClaims {
        return this.authStorage.accessTokenClaims;
    }

    /**
     * 
     * 
     * @readonly
     * @type {AcessoCidadaoResponse}
     * @memberOf AcessoCidadaoService
     */
    private get acessoCidadaoResponse(): AcessoCidadaoResponse {
        return this.authStorage.acessoCidadaoResponse;
    }

    /**
     * 
     * 
     * @param {Identity} data
     * @returns {Promise<AcessoCidadaoResponse>}
     */
    private async refreshAccessToken(): Promise<string> {

        if ( !this.acessoCidadaoResponse || AcessoCidadaoService.refreshingToken ) {
            return Promise.reject( new Error( 'Usuário não logado' ) );
        }

        AcessoCidadaoService.refreshingToken = true;

        try {
            await this.login( this.createRefreshTokenIdentity() );
            return this.acessoCidadaoResponse.access_token;
        } finally {
            AcessoCidadaoService.refreshingToken = false;
        }
    }

    /**
     * 
     * 
     * @private
     * @returns {AcessoCidadaoIdentity}
     * 
     * @memberOf AcessoCidadaoService
     */
    private createRefreshTokenIdentity(): AcessoCidadaoIdentity {
        let identity: AcessoCidadaoIdentity = {
            client_id: this.settings.identityServer.clients.espmExternalLoginAndroid.id,
            client_secret: this.settings.identityServer.clients.espmExternalLoginAndroid.secret,
            grant_type: 'refresh_token',
            scope: this.settings.identityServer.defaultScopes
        };

        if ( this.accessTokenClaims.client_id === 'espm' ) {
            identity.client_id = this.settings.identityServer.clients.espm.id;
            identity.client_secret = this.settings.identityServer.clients.espm.secret;
        }

        identity.refresh_token = this.acessoCidadaoResponse.refresh_token;

        return identity;
    }

    /**
     * 
     * 
     * @private
     * @param {*} data
     * @param {boolean} success
     * 
     * @memberOf AcessoCidadaoService
     */
    private sendAnswers( data: any, success: boolean ) {
        if ( !!data.provider ) {
            this.answersService.sendLogin( 'AcessoCidadao', success, { provider: data.provider, grant_type: data.grant_type });
        } else {
            this.answersService.sendLogin( 'AcessoCidadao', success, { grant_type: data.grant_type });
        }
    }

    /**
     *  Faz a requisição de um token no IdentityServer3, a partir dos dados fornecidos
     * 
     * @private
     * @param {Identity} data
     * @returns {Promise<AcessoCidadaoResponse>}
     * 
     * @memberOf AcessoCidadaoService
     */
    private getToken( identity: Identity ): Promise<AcessoCidadaoResponse> {
        return this.$http( this.getRequestTokenOptions( identity ) )
            .then(( response: IHttpPromiseCallbackArg<AcessoCidadaoResponse> ) => response.data );
    }

    /**
     * 
     * 
     * @private
     * @param {Date} date
     * @returns
     */
    private tokenIsExpiredIn( date: Date ) {
        return !!this.accessTokenClaims && this.accessTokenClaims.exp * 1000 - date.getTime() <= 0;
    }

    /**
     * 
     * 
     * @private
     * @param {Date} date
     * @returns
     */
    private tokenIsExpiringIn( date: Date ) {
        // Check if it's time to refresh the token based on the token expiration date.
        // token.expires_in * 500 = ( token expiration time * 1000 / 2 )
        return !this.tokenIsExpiredIn( date ) && this.accessTokenClaims.exp * 1000 - date.getTime() < this.acessoCidadaoResponse.expires_in * 500;
    }

    /**
     * Persiste informações do acesso cidadão no local storage.
     * 
     * @param {AcessoCidadaoResponse} response
     */
    private saveTokenOnLocalStorage( response: AcessoCidadaoResponse ) {
        this.authStorage.acessoCidadaoResponse = response;
        this.authStorage.accessTokenClaims = this.getAccesTokenClaims( response.access_token );
    }

    /**
    * Faz o parse do token e retorna os claims do usuário
    * 
    * @return {Claim} Claims do usuário
    */
    private getAccesTokenClaims( token: string ): AccessTokenClaims {
        let [ , encodedClaims ] = token.split( '.' );
        return angular.fromJson( this.urlBase64Decode( encodedClaims ) );
    }

    /**
     * Decodifica uma url Base64
     */
    private urlBase64Decode( encoded: string ): string {

        let output = encoded.replace( '-', '+' ).replace( '_', '/' );

        switch ( output.length % 4 ) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return this.$window.atob( output );
    }

    /**
     * 
     * 
     * @private
     * @param {any} data
     * @returns
     */
    private getRequestTokenOptions( data ) {
        let getTokenUrl = `${this.identityServerUrl}/connect/token`;

        let options: IRequestConfig = {
            url: getTokenUrl,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Send-Authorization': 'no'
            },
            transformRequest: function ( obj ) {
                let str: string[] = [];
                for ( let p in obj ) {
                    if ( obj.hasOwnProperty( p ) ) {
                        str.push( encodeURIComponent( p ) + '=' + encodeURIComponent( obj[ p ] ) );
                    }
                }
                return str.join( '&' );
            },
            data: data
        };

        return options;
    }
}
