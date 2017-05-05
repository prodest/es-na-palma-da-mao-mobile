export class FavoritesModalController {

    public static $inject: string[] = [ '$mdDialog' ];

    public selectedOrigins: any[];
    public slected: any[];

    /**
     * @constructor
     *
     * @param $mdDialog
     */
    constructor( private $mdDialog: angular.material.IDialogService ) {

    }

    /**
     *
     */
    public cancel() {
        this.$mdDialog.cancel();
    }

    /**
     *
     */
    public ok( type: string ) {
        this.$mdDialog.hide( type );
    }
}


