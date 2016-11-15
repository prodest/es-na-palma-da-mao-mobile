import { IWindowService, IHttpService, IRequestConfig, IHttpPromiseCallbackArg } from 'angular';
import { Token, AcessoCidadaoClaims, LowLevelProtocolClaims, Identity, AcessoCidadaoIdentity } from './models/index';
import { Settings } from '../settings/index';
import { AnswersService } from '../fabric/index';

/**
 * Classe para autenticação usando IdentityServer3 no acessso cidadão
 * Centraliza acesso a token, claims e local-storage de autenticação
 * 
 * @export
 * @class AcessoCidadaoService
 */
export class AcessoCidadaoService {

    public static $inject: string[] = [ '$window', '$http', '$localStorage', 'settings', 'answersService' ];
    private identityServerUrl: string;
    private static refreshingToken: boolean = false;

    /**
     * Creates an instance of AcessoCidadaoService.
     * 
     * @param {IWindowService} $window
     * @param {IHttpService} $http
     * @param {any} $localStorage
     * @param {Settings} settings
     * @param {AnswersService} answersService
     * 
     * @memberOf AcessoCidadaoService
     */
    constructor( private $window: IWindowService,
        private $http: IHttpService,
        private $localStorage,
        private settings: Settings,
        private answersService: AnswersService ) {
    }


    /**
     * 
     * 
     * @param {string} identityServerUrl
     * 
     * @memberOf AcessoCidadaoService
     */
    public initialize( identityServerUrl: string ): void {
        this.identityServerUrl = identityServerUrl;
    }

    /**
     * 
     * 
     * @readonly
     * @type {Token}
     * @memberOf AcessoCidadaoService
     */
    public get token(): Token {
        return this.$localStorage.token;
    }

    /**
     * Claims dos protocolos de autenticação utilizado.
     * 
     * @return {LowLevelProtocolClaims}
     */
    public get tokenClaims(): LowLevelProtocolClaims {
        return this.$localStorage.tokenClaims;
    }

    /**
     * Claims do usuário no acesso cidadão
     * 
     * @readonly
     * @type {AcessoCidadaoClaims}
     */
    public get userClaims(): AcessoCidadaoClaims {
        return this.$localStorage.userClaims;
    }

    /**
     * Verifica se o token não está expirado == usuário autenticado.
     * 
     * @readonly
     * @type {boolean}
     */
    public get authenticated(): boolean {
        return !!this.token && !!this.tokenClaims && !this.tokenIsExpiredIn( new Date() );
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
            this.$localStorage.anonymousLogin = false;
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
    public logout( success: () => {}): void {
        this.$localStorage.$reset();
        success();
    }

    /**
     * Atualiza o access token quando necessário baseado em sua data de expiração.
     * 
     * @returns {Promise<{}>}
     */
    public async refreshTokenIfNeeded(): Promise<Token> {

        let currentDate = new Date();

        if ( !this.tokenClaims || !this.token ) {
            return Promise.reject( { message: 'no-token' });
        }

        // Usa o token ainda válido e faz um refresh token em background (não-bloqueante)
        if ( this.tokenIsExpiringIn( currentDate )  ) {
            this.refreshToken();
            return Promise.resolve( this.token );
        }

        // Faz um refresh token e espera pra retornar o novo token "refreshado"
        if ( this.tokenIsExpiredIn( currentDate ) ) {
            return await this.refreshToken();
        }

        return Promise.resolve( this.token );
    }

    /**
     * Obtém as claims do usuário no acesso cidadão.
     * 
     * @returns
     */
    public getAcessoCidadaoUserClaims(): Promise<AcessoCidadaoClaims> {
        let userClaimsUrl = `${this.identityServerUrl}/connect/userinfo`;

        return this.$http.get( userClaimsUrl )
            .then(( response: IHttpPromiseCallbackArg<AcessoCidadaoClaims> ) => {
                if ( angular.isDefined( response.data!.sub ) ) {
                    this.$localStorage.userClaims = response.data;
                }
                return response.data;
            });
    }




    /************************************* Private API *************************************/

    /**
     * 
     * 
     * @param {Identity} data
     * @returns {Promise<Token>}
     */
    private async refreshToken(): Promise<Token> {

        if ( !this.token || AcessoCidadaoService.refreshingToken ) {
            return Promise.reject( new Error( 'Usuário não logado' ) );
        }

        AcessoCidadaoService.refreshingToken = true;

        try {
            await this.login( this.createRefreshTokenIdentity() );
            return this.token;
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


        if ( this.tokenClaims.client_id === 'espm' ) {
            identity.client_id = this.settings.identityServer.clients.espm.id;
            identity.client_secret = this.settings.identityServer.clients.espm.secret;
        }

        identity.refresh_token = this.token.refresh_token;

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
     * @returns {Promise<Token>}
     * 
     * @memberOf AcessoCidadaoService
     */
    private getToken( identity: Identity ): Promise<Token> {
        return this.$http( this.getRequestTokenOptions( identity ) )
            .then(( response: IHttpPromiseCallbackArg<Token> ) => response.data );
    }

    /**
     * 
     * 
     * @private
     * @param {Date} date
     * @returns
     */
    private tokenIsExpiredIn( date: Date ) {
        return this.tokenClaims.exp * 1000 - date.getTime() <= 0;
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
        return !this.tokenIsExpiredIn( date ) && this.tokenClaims.exp * 1000 - date.getTime() < this.token.expires_in * 500;
    }

    /**
     * Persiste informações do token no local storage.
     * 
     * @param {Token} token
     */
    private saveTokenOnLocalStorage( token: Token ) {
        this.$localStorage.token = token;
        this.$localStorage.tokenClaims = this.getTokenClaims( token );
    }

    /**
    * Faz o parse do token e retorna os claims do usuário
    * 
    * @return {Claim} Claims do usuário
    */
    private getTokenClaims( token: Token ): LowLevelProtocolClaims | undefined {
        let claims: LowLevelProtocolClaims | undefined = undefined;

        if ( angular.isDefined( token ) ) {
            let [ , encodedClaims ] = token.access_token.split( '.' );
            claims = angular.fromJson( this.urlBase64Decode( encodedClaims ) );
        }
        return claims;
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
