export class DatesFilterController {

    public static $inject: string[] = [ '$mdDialog' ];

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
    public ok( dateMin, dateMax ) {
        this.$mdDialog.hide( {
            dateMin,
            dateMax
        } );
    }
}


