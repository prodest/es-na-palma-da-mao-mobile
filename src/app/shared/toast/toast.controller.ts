import { ToastOptions } from './models/index';

/**
 * Controller
 */
export class ToastController {

    public static $inject: string[] = [ 'displayOption' ];

    /**
     * Creates an instance of ToastController.
     * 
     * @param {IToastOptions} displayOption
     */
    constructor( public displayOption: ToastOptions ) {
        this.activate();
    }

    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public activate() {
    }
}

