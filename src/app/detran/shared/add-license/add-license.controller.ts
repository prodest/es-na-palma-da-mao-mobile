import { ToastService } from '../../../shared/toast/index';

export class AddLicenseController {

    public static $inject: string[] = [ '$mdDialog', 'toast' ];

    /**
     * Creates an instance of RegisterLicenseController.
     * 
     * @param {any} $mdDialog
     * @param {ToastService} toast
     */
    constructor( private $mdDialog, private toast: ToastService ) { }


    /**
     * 
     */
    public cancel() {
        this.$mdDialog.cancel();
    }

    /**
     * 
     * 
     * @param {string} registerNumber
     * @param {string} ballot
     * @returns
     */
    public ok( registerNumber: string, ballot: string ) {

        if ( !registerNumber ) {
            this.toast.info( { title: 'Nº do registro é obrigatório' }); return;
        }
        if ( !ballot ) {
            this.toast.info( { title: 'Nº da cédula é obrigatório' }); return;
        }

        if ( isNaN( +registerNumber ) ) {
            this.toast.info( { title: 'Nº do registro deve conter somente números' }); return;
        }

        if ( isNaN( +ballot ) ) {
            this.toast.info( { title: 'Nº da cédula deve conter somente números' }); return;
        }

        this.$mdDialog.hide( {
            registerNumber,
            ballot
        });
    }
}
