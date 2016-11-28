import { IPromise } from 'angular';

/**
 * Serviço que centraliza configurações e chamadas a janelas de diálogo
 */
export class DialogService {

    public static $inject: string[] = [ '$mdDialog' ];

    private defaultOptions;

    /**
     * @constructor
     *
     * @param {Object} $mdDialog - serviço $mdDialog do angular-material
     *
     * @returns {void}
     */
    constructor( private $mdDialog: angular.material.IDialogService ) {
        this.defaultOptions = {
            confirm: {
                ok: 'Confirmar',
                cancel: 'Fechar'
            },
            alert: {
                ok: 'Fechar',
                clickOutsideToClose: true
            }
        };
    }

    /**
     * Exibe janela do tipo 'alert'
     *
     * @param {Object} contextualOptions -  opções fornecidas no contexto da chamada ao dialog
     *
     * @returns {Promise} - uma promise
     */
    public alert( contextualOptions ): IPromise<any> {
        let opts = this.buildOptionsTo( 'alert', contextualOptions );

        let alert = this.$mdDialog.alert()
            .clickOutsideToClose( opts.clickOutsideToClose )
            .title( opts.title )
            .textContent( opts.content )
            .htmlContent( opts.htmlContent )
            .targetEvent( opts.targetEvent )
            .ok( opts.ok );
        return this.$mdDialog.show( alert );
    }

    /**
     * Exibe janela do tipo 'confirm'
     *
     * @param {Object} contextualOptions -  opções fornecidas no contexto da chamada ao dialog
     *
     * @returns {Promise} - uma promise
     */
    public confirm( contextualOptions ): IPromise<any>  {
        let opts = this.buildOptionsTo( 'confirm', contextualOptions );

        let confirm = this.$mdDialog.confirm()
            .title( opts.title )
            .textContent( opts.content )
            .htmlContent( opts.htmlContent )
            .targetEvent( opts.targetEvent )
            .ok( opts.ok )
            .cancel( opts.cancel );
        return this.$mdDialog.show( confirm );
    }

    /**
     * Cancela a janela de diálogo aberta
     *
     * @returns {void}
     */
    public cancel() {
        this.$mdDialog.cancel();
    }

    /**
     * Fecha a janela de diálogo aberta
     *
     * @returns {void}
     */
    public ok(): IPromise<any>  {
        return this.$mdDialog.hide();
    }

    /**
     * Monta um objeto de configuração para o dialog usando as configurações
     * default + as opções passadas no contexto da chamada ao dialog
     *
     * @param {string} dialogTypeName - o tipo de janela sendo exibida ( 'alert', 'confirm' )
     * @param {Object} contextualOptions - opções fornecidas no contexto da chamada ao dialog
     *
     * @returns {Object} - um objeto de configuração para o dialog
     *
     * @private
     */
    private buildOptionsTo( dialogTypeName, contextualOptions ) {
        return angular.merge( {}, this.defaultOptions[ dialogTypeName ], contextualOptions );
    }
}
