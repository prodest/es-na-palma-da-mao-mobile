import { IPromise } from 'angular';
import template = require('./toast.html');
import { ToastOptions } from './models/index';

/**
 * Supplies a function that will continue to operate until the
 * time is up.
 */

/**
 * Controller
 */
export class ToastService {

    public static $inject: string[] = [
        '$mdToast'
    ];

    /**
     * Toast service: exibe notificações no estilo toasts
     *
     * @constructor
     *
     * @param {Object} $mdToast - $mdToast service do angular-material
     *
     * @returns {void}
     */
    constructor( private $mdToast: angular.material.IToastService ) {
    }

    /**
     * Exibe notificação
     *
     * @param {Object} displayOption - opções de exibição do toast usados para preencher a view
     *
     * @returns {Promise} - retorna uma promise
     */
    public show( displayOption: ToastOptions ): IPromise<any> {
        return this.$mdToast.show( {
            controller: 'toastController',
            controllerAs: 'vm',
            template: template,
            hideDelay: 3000,
            position: 'bottom right',
            locals: {
                displayOption: displayOption
            }
        } );
    }

    /**
     * 
     * 
     * @param {any} displayOption
     * @returns
     */
    public showActionToast( config: { message: string, action: string, hideDelay: number } ): IPromise<any> {
        let toast = this.$mdToast.simple()
                        .textContent( config.message )
                        .action( config.action )
                        .hideDelay( config.hideDelay )
                        .highlightAction( true )
                        .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                        .position( 'bottom right' );

        return this.$mdToast.show( toast );
    }

    /**
     * Esconde o toast
     *
     * @returns {Promise} - retorna uma promise
     */
    public hide() {
        return this.$mdToast.hide();
    }

    /**
     * Exibe toast de sucesso
     *
     * @param {Object} displayOption - Opções passadas para a view
     *
     * @returns {Promise} - retorna uma promise
     */
    public success( displayOption: ToastOptions ): IPromise<any> {
        return this.show( angular.merge( displayOption, { type: 'success' } ) );
    }

    /**
     * Exibe toast de erro
     *
     * @param {Object} displayOption - Opções passadas para a view
     *
     * @returns {Promise} - retorna uma promise
     */
    public error( displayOption: ToastOptions ): IPromise<any> {
        return this.show( angular.merge( displayOption, { type: 'error' } ) );
    }

    /**
     *
     * @param {Object} displayOption - Opções passadas para a view
     *
     * @returns {Promise} - retorna uma promise
     */
    public info( displayOption: ToastOptions): IPromise<any> {
        return this.show( angular.merge( displayOption, { type: 'info' } ) );
    }

    /**
     *
     * @param {Object} displayOption - Opções passadas para a view
     *
     * @returns {Promise} - retorna uma promise
     */
    public warn( displayOption: ToastOptions ): IPromise<any> {
        return this.show( angular.merge( displayOption, { type: 'warn' } ) );
    }
}
