import { IPromise } from 'angular';
import { InAppBrowser, InAppBrowserEvent } from 'ionic-native';
import { ToastService, DialogService, TransitionService } from '../shared/index';
import { AuthenticationService, Identity } from '../shared/authentication/index';
import { PushService } from '../shared/push/index';

/**
 * 
 * 
 * @class LoginController
 */
export class LoginController {
    /**
     * 
     * 
     * @static
     * @type {string[]}
     */
    public static $inject: string[] = [
        'authenticationService',
        'dialog',
        'toast',
        'pushService',
        'transitionService'
    ];

    public processingLogin: boolean = false;
    public username: string | undefined;
    public password: string | undefined;
    public errorMsgs = {
        accountNotLinked: 'User not found.' // Verification message with AcessoCidadao
    };

    /**
     * Creates an instance of LoginController.
     * 
     * @param {AuthenticationService} authenticationService
     * @param {DialogService} dialog
     * @param {ToastService} toast
     * @param {PushConfig} pushConfig
     * 
     * @memberOf LoginController
     */
    constructor( private authenticationService: AuthenticationService,
        private dialog: DialogService,
        private toast: ToastService,
        private pushService: PushService,
        private transitionService: TransitionService ) {
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf LoginController
     */
    public onEnterPressed() {
        if ( !this.username || !this.password ) {
            return;
        }
        this.loginWithCredentials( this.username, this.password );
    }

    /**
     * Executa login na aplicação de acordo com as configurações do settings, usuário e senha.
     */
    public loginWithCredentials( username: string, password: string ): void {

        this.processingLogin = true;

        if ( !username || !password ) {
            this.toast.info( { title: 'Login e senha são obrigatórios' }); return;
        }

        this.authenticationService.signInWithCredentials( username, password )
            .then(() => this.onAcessoCidadaoLoginSuccess() )
            .catch( error => this.onAcessoCidadaoLoginError( error ) )
            .finally(() => this.processingLogin = false );
    }


    /**
     * Efetua login no acesso cidadão usando um identity.
     * 
     * @param {Identity} identity
     */
    public loginWithIdentity( identity: Identity ): IPromise<void> {
        return this.authenticationService.signInWithIdentity( identity )
            .then(() => this.onAcessoCidadaoLoginSuccess() )
            .catch( error => this.onAcessoCidadaoLoginError( error ) );
    }

    /**
     * Realiza o login usando o facebook
     * https://github.com/jeduan/cordova-plugin-facebook4
     */
    public facebookLogin(): Promise<void> {
        return this.authenticationService.facebookLogin()
            .then(( identity ) => this.loginWithIdentity( identity ) )
            .catch(() => this.toast.error( { title: '[Facebook] Falha no login' }) );
    }

    /**
     * Realiza o login usando conta do google
     */
    public googleLogin(): Promise<void> {
        return this.authenticationService.googleLogin()
            .then( identity => this.loginWithIdentity( identity ) )
            .catch(() => this.toast.error( { title: '[Google] Falha no login' }) );
    }

    /**
     * Realiza login digits
     */
    public digitsLogin(): IPromise<void> {
        return this.authenticationService.digitsLogin()
            .then(( identity ) => this.loginWithIdentity( identity ) )
            .catch(() => this.toast.error( { title: '[SMS] Falha no login' }) );
    }


    /**
     * Callback de sucesso no login no acesso cidadão.
     */
    public onAcessoCidadaoLoginSuccess(): void {
        this.pushService.init();
        this.username = undefined;
        this.password = undefined;
        this.transitionService.clearCache().then(() => this.goToDashboard() );
    }

    /**
     * Callback de erro no login no acesso cidadão.
     * 
     * @param {{ data: { error: string } }} error
     */
    public onAcessoCidadaoLoginError( error: { data: { error: string } }): void {
        if ( this.isAccountNotLinked( error.data ) ) {
            this.showDialogAccountNotLinked();
        } else {
            this.toast.error( { title: 'Falha no Login' });
        }
    }

    /**
     * 
     * 
     * 
     * @memberOf LoginController
     */
    public showDialogAccountNotLinked(): void {
        this.dialog.confirm( {
            title: 'Conta não vinculada',
            content: 'Acesse utilizando o usuário e senha ou clique para criar uma nova conta',
            ok: 'Criar conta'
        }).then(() => {
            this.openInAppBrowser('https://acessocidadao.es.gov.br/Conta/VerificarCPF');
        });
    }

    /**
     * 
     * 
     * @param {any} data
     * @returns {boolean}
     */
    public isAccountNotLinked( data ): boolean {
        return data.error === this.errorMsgs.accountNotLinked;
    }

    /**
     * Redireciona usuário para o dashboard
     */
    public goToDashboard(): void {
        this.transitionService.changeRootState( 'app.dashboard.newsHighlights' );
    }

    /**
     * Abre a janela(no browser) de recuperar senha do acesso cidadão.
     */
    public openUrlForgotPassword(): void {
        this.openInAppBrowser('https://acessocidadao.es.gov.br/Conta/SolicitarReinicioSenha');
    }

    /**
     * 
     * 
     * @private
     * @param {string} url
     * 
     * @memberOf LoginController
     */
    private openInAppBrowser( url: string ): void {
        let options = 'toolbar=no,location=no,clearcache=yes,clearsessioncache=yes,closebuttoncaption=Cancelar';
        let browser = new InAppBrowser( url + '?espmplatform=' + ionic.Platform.platform(), '_blank', options );

        browser.on( 'loadstart' ).subscribe(( event: InAppBrowserEvent ) => {
            if ( event.url === 'https://acessocidadao.es.gov.br/' ) {
                browser.close();
            }
        } );
        browser.on( 'loaderror' ).subscribe(( event: InAppBrowserEvent ) => browser.close() );
    }
}
