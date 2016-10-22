
import { NonFatal } from './models/index';
import { Error } from '../http/models/index';

export class CrashlyticsService {

    /**
     * 
     * 
     * @static
     * @type {string[]}
     */
    public static $inject: string[] = [ '$window' ];

    /**
     * Creates an instance of CrashlyticsService.
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
     * @private
     * @param {NonFatal} error
     */
    private nonFatal( error: NonFatal ): void {
        // this.$window.plugins.digits.setUserName( username );
        // this.$window.plugins.digits.setUserEmail( email );

        if ( angular.isDefined( error.stringData ) ) {
            Object.keys( error.stringData ).forEach(( key ) => {
                let value = error.stringData[ key ];
                if ( typeof ( value ) === 'string' ) {
                    this.$window.plugins.digits.setStringValueForKey( error.stringData[ key ], key );
                }
            });
        }

        if ( angular.isDefined( error.booleanData ) ) {
            Object.keys( error.booleanData ).forEach(( key ) => {
                let value = error.booleanData[ key ];
                if ( typeof ( value ) === 'boolean' ) {
                    this.$window.plugins.digits.setBoolValueForKey( error.booleanData[ key ], key );
                }
            });
        }

        if ( angular.isDefined( error.numberData ) ) {
            Object.keys( error.numberData ).forEach(( key ) => {
                let value = error.numberData[ key ];
                if ( typeof ( value ) === 'number' ) {
                    this.$window.plugins.digits.setIntValueForKey( error.numberData[ key ], key );
                }
            });
        }

        this.$window.plugins.digits.sendNonFatalCrash( error.message );
    }

    /**
     * 
     * 
     * @param {Error} error
     */
    public httpNonFatal( error: Error ) {
        // TODO: trata o erro padrão HTTP se necessário

        if ( this.hasPlugin ) {

            let nonFatalError: NonFatal = {
                message: error.message,
                stringData: {
                    guid: error.guid
                },
                booleanData: {
                    handled: error.handled
                },
                numberData: {
                    status: error.status
                }
            };

            this.nonFatal( nonFatalError );
        }
    }
}
