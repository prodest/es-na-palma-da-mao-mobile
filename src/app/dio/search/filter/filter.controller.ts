import { ToastService } from '../../../shared/shared.module';

export class FilterController {

    public static $inject: string[] = [ '$mdDialog', 'toast' ];

    /**
     * Creates an instance of FilterController.
     * 
     * @param {any} $mdDialog
     * @param {ToastService} toast
     */
    constructor( private $mdDialog, private toast: ToastService ) {}


    /**
     * 
     */
    public cancel() {
        this.$mdDialog.cancel();
    }


    /**
     * 
     * 
     * @param {string} query
     * @param {any} dateMin
     * @param {any} dateMax
     * @returns
     */
    public ok( query: string, dateMin, dateMax ) {

        if ( !query ) {
             this.toast.info( { title: 'Palavra-chave é obrigatória' } ); return;
        }

        this.$mdDialog.hide( {
            query,
            dateMin,
            dateMax
        } );
    }
}


