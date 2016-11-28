export class SourcesFilterController {

    public static $inject: string[] = [ '$mdDialog' ];

    public selectedOrigins: any[];
    public availableOrigins: any[];

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
    public ok( selectedOrigins ) {
        this.$mdDialog.hide( { origins: selectedOrigins } );
    }

    /**
     *
     * @returns {boolean}
     */
    public isIndeterminate() {
        return ( this.selectedOrigins.length !== 0 && this.selectedOrigins.length !== this.availableOrigins.length );
    }

    /**
     *
     * @returns {boolean}
     */
    public isAllChecked() {
        return this.selectedOrigins.length !== 0 && this.selectedOrigins.length === this.availableOrigins.length;
    }

    /**
     *
     */
    public toggleAllChecked() {
        if ( this.isAllChecked() ) {
            this.selectedOrigins = [];
        } else if ( this.selectedOrigins.length === 0 || this.selectedOrigins.length > 0 ) {
            this.selectedOrigins = this.availableOrigins.slice( 0 );
        }
    }

    /**
     *
     * @param origin
     */
    public toggleChecked( origin ) {
        let idx = this.selectedOrigins.indexOf( origin );
        if ( idx > -1 ) {
            this.selectedOrigins.splice( idx, 1 );
        } else {
            this.selectedOrigins.push( origin );
        }
    }

    /**
     *
     * @param origin
     * @returns {boolean}
     */
    public isSelected( origin ) {
        return this.selectedOrigins.indexOf( origin ) > -1;
    }
}


