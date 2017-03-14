export class AuthNeededController {

    public static $inject: string[] = [ '$mdDialog' ];

    /**
     * @constructor
     *
     * @param $mdDialog
     */
    constructor( private $mdDialog: angular.material.IDialogService ) {

    }

    public ok() {
        this.$mdDialog.hide();
    }

    public cancel() {
        this.$mdDialog.cancel();
    }
}
