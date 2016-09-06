import angular from 'angular';

export class AnswersService {

    /**
     * 
     * 
     * @static
     * @type {string[]}
     */
    public static $inject: string[] = [ '$window' ];

    /**
     * Creates an instance of AnswersService.
     * 
     * @param {any} $window
     */
    constructor( private $window ) {
    }

    /**
     * 
     * 
     * @readonly
     * @private
     * @type {boolean}
     */
    private get hasPlugin(): boolean {
        if ( angular.isDefined( this.$window.plugins ) && angular.isDefined( this.$window.plugins.digits ) ) {
            return true;
        }
        return false;
    }

    /**
     * 
     * 
     * @param {string} method
     * @param {boolean} success
     * @param {any} attributes
     */
    public sendLogin( method: string, success: boolean, attributes ) {
        if ( this.hasPlugin ) {
            this.$window.plugins.digits.sendLogIn( method, success, attributes );
        }
    }
}
