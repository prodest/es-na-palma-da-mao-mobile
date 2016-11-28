
/**
 * 
 * @export
 * @class CordovaPermissions
 */
export class CordovaPermissions {

    public static $inject: string[] = [ '$window' ];

    /**
     *  
     * @private
     * @type {*}
     */
    private permissions: any;

    /**
     * Creates an instance of CordovaPermissions.
     * 
     */
    constructor(private $window: Window) {
        if ( this.isCordovaAppWithPermissions ) {
            this.permissions = cordova.plugins.permissions;
        }
    }

    private get isCordovaAppWithPermissions() {
        return !!this.$window.cordova && !!this.$window.cordova.plugins && !!this.$window.cordova.plugins.permissions;
    }

    /**
     * 
     */
    public RequestCoarseLocationPermission() {
        this.RequestPermissions( [ 'android.permission.ACCESS_COARSE_LOCATION' ] );
    }

    /**
     * 
     * 
     * @param {( status: any ) => void} successCallback
     */
    public HasCoarseLocationPermission( successCallback: ( status: any ) => void ) {
        this.HasPermission( 'android.permission.ACCESS_COARSE_LOCATION', successCallback );
    }

    /**
     * 
     * 
     * @param {string[]} permissions
     */
    public RequestPermissions( permissions: string[] ): void {
        if ( this.permissions ) {
            this.permissions.requestPermissions( permissions, ( status: any[] ) => status, this.HandleError );
        }
    }

    /**
     * 
     * 
     * @param {string} permission
     * @param {( status: any ) => void} successCallback
     */
    public HasPermission( permission: string, successCallback: ( status: any ) => void ): void {
        if ( this.permissions ) {
            this.permissions.hasPermission( permission, successCallback, this.HandleError );
        }
    }

    /**
     * 
     * 
     * @private
     * @param {any} error
     */
    private HandleError( error ) {
        console.log( error );
    }
}
