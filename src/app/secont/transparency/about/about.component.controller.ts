import { IWindowService } from 'angular';

export class TransparencyAboutController {

    public static $inject: string[] = [ '$window' ];

    /**
     * Creates an instance of TransparencyAboutController.
     * 
     * @param {IWindowService} $window
     * 
     * @memberOf TransparencyAboutController
     */
    constructor( private $window: IWindowService ) {
    }

    /**
     * 
     * 
     * @param {string} url
     */
    public openLink( url: string ): void {
        this.$window.open( url, '_system' );
    }

}
