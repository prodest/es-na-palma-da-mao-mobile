import { InAppBrowser, InAppBrowserEvent } from 'ionic-native';
import { TransitionService } from '../shared/index';

export class HomeController {

    public static $inject: string[] = [ 'transitionService' ];

    /**
     * Creates an instance of HomeController.
     * 
     * @param {IWindowService} $window
     * @param {ISettings} settings
     */
    constructor( private transitionService: TransitionService ) {
    }

    /**
     *
     */
    public navigateToLogin(): void {
        this.transitionService.changeState( 'login' );
    }

    /**
     * Redireciona para 1ª tela do processo de criação de conta
     */
    public createAccount(): void {
        let platform = ionic.Platform.platform();
        let options = 'toolbar=no,location=no,clearcache=yes,clearsessioncache=yes,closebuttoncaption=Cancelar';

        let browser = new InAppBrowser( 'https://acessocidadao.es.gov.br/Conta/VerificarCPF?espmplatform=' + platform, '_blank', options );

        browser.on( 'loadstart' ).subscribe(( event: InAppBrowserEvent ) => {
            if ( event.url === 'https://acessocidadao.es.gov.br/' ) {
                browser.close();
            };
        });
    }
}
