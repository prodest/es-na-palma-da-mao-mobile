import { InAppBrowser, InAppBrowserEvent } from 'ionic-native';
import { TransitionService } from '../shared/shared.module';
import { AuthenticationService } from '../security/security.module';
import { ISettings } from '../shared/shared.module';

export class HomeController {

    public static $inject: string[] = [ 'transitionService', 'authenticationService', 'settings' ];

    /**
     * Creates an instance of HomeController.
     * 
     * @param {IWindowService} $window
     * @param {AuthenticationService} authenticationService
     */
    constructor( private transitionService: TransitionService, 
                 private authenticationService: AuthenticationService,
                 private settings: ISettings  ) {
    }

    /**
     *
     */
    public navigateToLogin(): void {
        this.transitionService.changeState( 'login' );
    }

    /**
     * 
     * 
     * 
     * @memberOf HomeController
     */
    public anonymousLogin(): void {
        this.authenticationService.user.anonymous = true;
        this.transitionService.changeRootState( 'app.dashboard.newsHighlights' );
    }

    /**
     * Redireciona para 1ª tela do processo de criação de conta
     */
    public createAccount(): void {
        let options = 'toolbar=no,location=no,clearcache=yes,clearsessioncache=yes,closebuttoncaption=Cancelar';
        let browser = new InAppBrowser( `${this.settings.api.acessocidadao}/Conta/VerificarCPF?espmplatform=` + ionic.Platform.platform(), '_blank', options );

        browser.on( 'loadstart' ).subscribe(( event: InAppBrowserEvent ) => {
            if ( event.url === this.settings.api.acessocidadao ) {
                browser.close();
            }
        });
        browser.on( 'loaderror' ).subscribe(( event: InAppBrowserEvent ) => browser.close() );
    }
}
