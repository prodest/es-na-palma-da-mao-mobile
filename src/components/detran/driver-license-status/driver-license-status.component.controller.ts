import * as moment from 'moment';
import { IScope, IPromise, IQService } from 'angular';
import { DriverData, Ticket, DriverStatus, DetranApiService, TicketColorService, DriverLicenseStorage, DriverLicense } from '../shared/index';
import registerLicenseTemplate = require('../shared/add-license/add-license.html');
import { AddLicenseController } from '../shared/add-license/add-license.controller';

/**
 * @class DriverLicenseStatusController
 */
export class DriverLicenseStatusController {

    public static $inject: string[] = [ '$scope', '$q', 'ticketColorService', 'detranApiService', 'detranStorage', '$mdDialog' ];

    /**
     * Informações sobre a carteira de motorista do condutor
     * 
     * @type {DriverData}
     */
    public driverData: DriverData | undefined = undefined;
    public tickets: Ticket[] | undefined = undefined;
    public isRefreshing: boolean = false;

    /**
     * Creates an instance of DriverLicenseStatusController.
     * 
     * @param {IScope} $scope
     * @param {IQService} $q
     * @param {TicketColorService} ticketColorService
     * @param {DetranApiService} detranApiService
     * @param {DriverLicenseStorage} driverLicenseStorage
     * @param {angular.material.IDialogService} $mdDialog
     */
    constructor( private $scope: IScope,
        private $q: IQService,
        private ticketColorService: TicketColorService,
        private detranApiService: DetranApiService,
        private driverLicenseStorage: DriverLicenseStorage,
        private $mdDialog: angular.material.IDialogService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
        this.$scope.$on( '$ionicView.beforeEnter', () => angular.element( document.querySelectorAll( 'ion-header-bar' ) ).removeClass( 'espm-header-tabs' ) );
    }


    /**
     * Preenche a página com dados do condutor, bem como de suas eventuais multas.
     */
    public activate(): IPromise<any>[] {
        return [ this.getDriverData(), this.getDriverTickets() ];
    }

    /**
     * 
     * 
     * 
     * @memberOf DriverLicenseStatusController
     */
    public doRefresh() {
        this.isRefreshing = true;
        this.$q.all( this.activate() )
            .then(() => this.isRefreshing = false )
            .finally(() => this.$scope.$broadcast( 'scroll.refreshComplete' ) );
    }

    /**
     * Se o condutor autenticado no sistema está com a carteira de motorista 'ok'.
     * 
     * @readonly
     * @type {boolean}
     */
    public get licenseOk(): boolean {
        return !!this.driverData && this.driverData.status === DriverStatus.Ok;
    }


    /**
     * Se o condutor autenticado no sistema está com a carteira de motorista bloqueada.
     * 
     * @readonly
     * @type {boolean}
     */
    public get licenseBlocked(): boolean {
        return !!this.driverData && this.driverData.status === DriverStatus.Blocked;
    }

    /**
     * Se o condutor autenticado no sistema está com a carteira de motorista vencida.
     * 
     * @readonly
     * @type {boolean}
     */
    public get licenseExpired(): boolean {
        return !!this.expirationDate && moment( this.expirationDate ).add( 30, 'days' ).isBefore( moment().startOf( 'day' ) );
    }

    /**
     * Se a carteira de motorista do condutor precisa ser renovada (Período de até 1 mês após o vencimento)
     * 
     * @readonly
     * @type {boolean}
     */
    public get licenseRenew(): boolean {
        return !!this.expirationDate &&
            moment().startOf( 'day' ).isAfter( this.expirationDate ) &&
            moment( this.expirationDate ).add( 30, 'days' ).isAfter( moment().startOf( 'day' ) );
    }

    /**
     * A data de validade da carteira de motorista do condutor autenticado no sistema.
     * 
     * @readonly
     * @type {Date}
     */
    public get expirationDate(): Date | undefined {
        if ( this.driverData ) {
            return this.driverData.expirationDate;
        }
    }


    /**
     * Indica se existem multas para o condutor autenticado no sistema.
     * 
     * @readonly
     * @type {boolean}
     */
    public get hasTickets(): boolean {
        return !!this.tickets && this.tickets.length > 0;
    }


    /**
     * Obtem a cor relativa à uma classificação de multa. Usado somente na interface.
     * 
     * @param {string} level
     * @returns {string}
     */
    public getTicketLevelColor( level: string ): string {
        return this.ticketColorService.getTicketLevelColor( level );
    }

    /**
     * Obtem dados da carteira de motorista do condutor autenticado no sistema.
     * 
     * @returns {void}
     */
    public getDriverData(): IPromise<DriverData> {
        return this.detranApiService.getDriverData()
            .then(( driverData ) => {
                this.driverData = driverData;
                return driverData;
            })
            .catch(( error ) => {
                this.eraseData();
                return error;
            });
    }

    /**
     * Obtem as eventuais multas pertencentes ao condutor autenticado no sistema.
     * 
     * @returns {void}
     */
    public getDriverTickets(): IPromise<Ticket[]> {
        return this.detranApiService.getDriverTickets()
            .then( tickets => {
                this.tickets = tickets || [];
                return this.tickets;
            })
            .catch(( error ) => {
                this.eraseData();
                return error;
            });
    }


    /**
     * 
     */
    public editDriverLicense(): void {
        this.$mdDialog.show( {
            controller: AddLicenseController,
            template: registerLicenseTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: {
                registerNumber: Number( this.driverLicenseStorage.driverLicense.registerNumber ),
                ballot: Number( this.driverLicenseStorage.driverLicense.ballot )
            }
        })
            .then(( license: DriverLicense ) => {
                return this.detranApiService.saveLicense( license ).then(() => license );
            })
            .then(( license: DriverLicense ) => {
                this.driverLicenseStorage.driverLicense = license;
                return this.$q.all( this.activate() ); // atualiza a página
            });
    }

    /**
     * 
     * 
     * @private
     * @param {number} status
     */
    private eraseData() {
        this.tickets = undefined;
        this.driverData = undefined;
    }
}
