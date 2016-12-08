import { InAppBrowser, InAppBrowserEvent } from 'ionic-native';
import { ToastService, DialogService, TransitionService } from '../../shared/shared.module';
import { AuthenticationService } from '../shared/authentication.service';

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
        private transitionService: TransitionService ) {
    }

    /**
     * 
     * 
     * @returns
     * 
     * @memberOf LoginController
     */
    public async onEnterPressed() {
        await this.login( this.username, this.password );
    }

    /**
     * Executa login na aplicação de acordo com as configurações do settings, usuário e senha.
     */
    public async login( username?: string, password?: string ) {

        if ( !username || !password ) {
            this.toast.info( { title: 'Login e senha são obrigatórios' }); return;
        }

        await this.loginWith(() => this.authenticationService.acessoCidadaoLogin( username, password ) );
    }

    /**
     * Realiza o login usando o facebook
     * https://github.com/jeduan/cordova-plugin-facebook4
     */
    public async facebookLogin() {
        await this.loginWith(() => this.authenticationService.facebookLogin() );
    }

    /**
     * Realiza o login usando conta do google
     */
    public async googleLogin() {
        await this.loginWith(() => this.authenticationService.googleLogin() );
    }

    /**
     * Realiza login digits
     */
    public async digitsLogin() {
        await this.loginWith(() => this.authenticationService.digitsLogin() );
    }

    /**
     * Abre a janela(no browser) de recuperar senha do acesso cidadão.
     */
    public openUrlForgotPassword(): void {
        this.openInAppBrowser( 'https://acessocidadao.es.gov.br/Conta/SolicitarReinicioSenha' );
    }


    /************************************* Private API *************************************/

    private async loginWith( loginMethod: Function ) {
        try {
            this.processingLogin = true;
            await loginMethod();
            this.onLoginSuccess();
        } catch ( error ) {
            this.onLoginError( error );
        }
        finally {
            this.processingLogin = false;
        }
    }


    /**
     * Callback de sucesso no login no acesso cidadão.
     */
    private onLoginSuccess(): void {
        this.username = undefined;
        this.password = undefined;
        this.transitionService.clearCache().then(() => this.goToDashboard() );
    }

    /**
     * Callback de erro no login no acesso cidadão.
     * 
     * @param {{ data: { error: string } }} error
     */
    private onLoginError( error: { data?: { error: string } }): void {
        if ( error.data && this.isAccountNotLinkedError( error.data ) ) {
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
    private showDialogAccountNotLinked(): void {
        const options = {
            title: 'Conta não vinculada',
            content: 'Acesse utilizando o usuário e senha ou clique para criar uma nova conta',
            ok: 'Criar conta'
        };

        this.dialog.confirm( options ).then(() => {
            this.openInAppBrowser( 'https://acessocidadao.es.gov.br/Conta/VerificarCPF' );
        });
    }

    /**
     * 
     * 
     * @param {any} data
     * @returns {boolean}
     */
    private isAccountNotLinkedError( data ): boolean {
        return data.error === this.errorMsgs.accountNotLinked;
    }


    /**
     * Redireciona usuário para o dashboard
     */
    private goToDashboard(): void {
        this.transitionService.changeRootState( 'app.dashboard.newsHighlights' );
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
        });
        browser.on( 'loaderror' ).subscribe(( event: InAppBrowserEvent ) => browser.close() );
    }
}
