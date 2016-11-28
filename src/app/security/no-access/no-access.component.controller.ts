import { InAppBrowser, InAppBrowserEvent } from 'ionic-native';
import { TransitionService } from '../../shared/shared.module';

export class NoAccessController {

    public static $inject: string[] = [ 'transitionService' ];


    /**
     * Creates an instance of SignUpController.
     * 
     * @param {TransitionService} transitionService
     * 
     * @memberOf SignUpController
     */
    constructor( private transitionService: TransitionService) {}

    /**
     * 
     * 
     * 
     * @memberOf SignUpController
     */
    public navigateToLogin(): void {
        this.transitionService.changeState( 'login' );
    }

    /**
     * 
     * 
     * 
     * @memberOf SignUpController
     */
    public createAccount(): void {
        let options = 'toolbar=no,location=no,clearcache=yes,clearsessioncache=yes,closebuttoncaption=Cancelar';
        let browser = new InAppBrowser( 'https://acessocidadao.es.gov.br/Conta/VerificarCPF?espmplatform=' + ionic.Platform.platform(), '_blank', options );

        browser.on( 'loadstart' ).subscribe(( event: InAppBrowserEvent ) => {
            if ( event.url === 'https://acessocidadao.es.gov.br/' ) {
                browser.close();
            }
        } );
        browser.on( 'loaderror' ).subscribe(( event: InAppBrowserEvent ) => browser.close() );
    }
}
