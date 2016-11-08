import { IWindowService, IHttpService, IPromise, IQService, IRequestConfig } from 'angular';

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

    public static $inject: string[] = [ '$window', '$http', '$localStorage', '$q', 'settings', 'answersService' ];
    private identityServerUrl: string;
    private static refreshingToken: boolean = false;

    /**
     * Creates an instance of AcessoCidadaoService.
     * 
     * @param {IWindowService} $window
     * @param {IHttpService} $http
     * @param {any} $localStorage
     * @param {IQService} $q
     * @param {Settings} settings
     * @param {AnswersService} answersService
     */
    constructor( private $window: IWindowService,
        private $http: IHttpService,
        private $localStorage,
        private $q: IQService,
        private settings: Settings,
        private answersService: AnswersService ) {
    }

    /**
     * 
     * @param identityServerUrl
     */
    public initialize( identityServerUrl: string ): void {
        this.identityServerUrl = identityServerUrl;
    }

    /**
     * 
     * 
     * @readonly
     * @type {Token}
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
        return !!this.token && !!this.tokenClaims && this.tokenIsNotExpiredIn( new Date() );
    }

    /**
     * Autentica o usuário no acesso cidadão
     * 
     * @param {Identity} data
     * @returns {IPromise<AcessoCidadaoClaims>}
     */
    public signIn( data: Identity ): IPromise<AcessoCidadaoClaims> {
        return this.getToken( data )
            .then( token => {
                this.$localStorage.anonymousLogin = false;
                this.sendAnswers( data, true );
                this.saveTokenOnLocaStorage( token );
                return this.getAcessoCidadaoUserClaims();
            })
            .catch(( error ) => {
                this.sendAnswers( data, false );
                throw error;
            });
    }

    /**
     * 
     * 
     * @private
     * @param {*} data
     * @param {boolean} success
     */
    private sendAnswers( data: any, success: boolean ) {
        if ( !!data.provider ) {
            this.answersService.sendLogin( 'AcessoCidadao', success, { provider: data.provider, grant_type: data.grant_type });
        } else {
            this.answersService.sendLogin( 'AcessoCidadao', success, { grant_type: data.grant_type });
        }
    }

    /**
     * Faz a requisição de um token no IdentityServer3, a partir dos dados fornecidos.
     */
    protected getToken( data: Identity ): IPromise<Token> {
        return this.$http( this.getRequestTokenOptions( data ) )
            .then(( response: { data: Token }) => {
                return response.data;
            });
    }

    /**
     * 
     * 
     * @param {Identity} data
     * @returns {IPromise<AcessoCidadaoClaims>}
     */
    public refreshToken(): IPromise<AcessoCidadaoClaims> {
        if ( this.token && !AcessoCidadaoService.refreshingToken ) {
            AcessoCidadaoService.refreshingToken = true;
            try {

                let identity: AcessoCidadaoIdentity = {
                    client_id: '',
                    client_secret: '',
                    grant_type: 'refresh_token',
                    scope: this.settings.identityServer.defaultScopes
                };

                if ( this.tokenClaims.client_id === 'espm' ) {
                    identity.client_id = this.settings.identityServer.clients.espm.id;
                    identity.client_secret = this.settings.identityServer.clients.espm.secret;
                } else {
                    identity.client_id = this.settings.identityServer.clients.espmExternalLoginAndroid.id;
                    identity.client_secret = this.settings.identityServer.clients.espmExternalLoginAndroid.secret;
                }

                identity.refresh_token = this.token.refresh_token;
                return this.getToken( identity )
                    .then( token => {
                        this.saveTokenOnLocaStorage( token );
                        return this.getAcessoCidadaoUserClaims();
                    })
                    .finally(() => {
                        AcessoCidadaoService.refreshingToken = false;
                    });
            } catch ( err ) {
                AcessoCidadaoService.refreshingToken = false;
                throw err;
            }
        } else {
            return this.$q.reject( new Error( 'Usuário não logado' ) );
        }
    }


    /**
     * Atualiza o access token quando necessário baseado em sua data de expiração.
     * 
     * @returns {IPromise<{}>}
     */
    public refreshTokenIfNeeded(): IPromise<{}> {
        let currentDate = new Date();
        return this.$q(( resolve, reject ) => {
            if ( !this.tokenClaims || !this.token ) {
                return reject( { message: 'no-token' });
            }

            if ( this.tokenIsNotExpiredIn( currentDate ) ) {
                resolve( this.token );
            }

            if ( this.tokenIsExpiringIn( currentDate ) ) {
                return this.refreshToken()
                    .then(() => resolve( this.token ) )
                    .catch(( error ) => reject( error ) );
            }
        });
    }


    /**
     * 
     * 
     * @private
     * @param {Date} date
     * @returns
     */
    private tokenIsNotExpiredIn( date: Date ) {
        return this.tokenClaims.exp * 1000 - date.getTime() > 0;
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
        return this.tokenClaims.exp * 1000 - date.getTime() < this.token.expires_in * 500;
    }

    /**
     * Obtém as claims do usuário no acesso cidadão.
     * 
     * @returns
     */
    public getAcessoCidadaoUserClaims(): IPromise<AcessoCidadaoClaims> {
        let userClaimsUrl = `${this.identityServerUrl}/connect/userinfo`;

        return this.$http.get( userClaimsUrl )
            .then(( response: { data: AcessoCidadaoClaims }) => {
                // Check if the object is correct (This request can return the Acesso Cidadão login page)
                if ( angular.isDefined( response.data.sub ) ) {
                    this.$localStorage.userClaims = response.data;
                }

                return response.data;
            });
    }

    /**
     * Persiste informações do token no local storage.
     * 
     * @param {Token} token
     */
    protected saveTokenOnLocaStorage( token: Token ) {
        this.$localStorage.token = token;
        this.$localStorage.tokenClaims = this.getTokenClaims( token );
    }

    /**
     * Faz logout do usuário. Remove o token do localstore e os claims salvos.
     */
    public signOut( success ): void {
        this.$localStorage.$reset();
        success();
    }

    /**
    * Faz o parse do token e retorna os claims do usuário
    * 
    * @return {Claim} Claims do usuário
    */
    protected getTokenClaims( token: Token ): LowLevelProtocolClaims | undefined {
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
    protected urlBase64Decode( encoded: string ): string {

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
