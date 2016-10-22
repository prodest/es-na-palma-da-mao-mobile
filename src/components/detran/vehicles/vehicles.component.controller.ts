import { IScope } from 'angular';
import { Vehicle, VehicleStorage, DetranApiService, VehicleInfo } from '../shared/index';
import { DialogService, ToastService, TransitionService } from '../../shared/index';

import addVehicleTemplate = require('./add-vehicle/add-vehicle.html');
import { AddVehicleController } from './add-vehicle/add-vehicle.controller';

/**
 * 
 * 
 * @export
 * @class VehiclesController
 */
export class VehiclesController {

    public static $inject: string[] = [ '$scope', '$mdDialog', 'detranApiService', 'toast', 'dialog', 'detranStorage', 'transitionService' ];

    public editing: boolean = false;

    /**
     * Creates an instance of VehiclesController.
     * 
     * @param {IScope} $scope
     * @param {angular.material.IDialogService} $mdDialog
     * @param {DetranApiService} detranApiService
     * @param {ToastService} toast
     * @param {DialogService} dialog
     * @param {VehicleStorage} vehicleStorage
     * 
     * @memberOf VehiclesController
     */
    constructor( private $scope: IScope,
        private $mdDialog: angular.material.IDialogService,
        private detranApiService: DetranApiService,
        private toast: ToastService,
        private dialog: DialogService,
        private vehicleStorage: VehicleStorage,
        private transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     * 
     */
    public activate(): void {
        angular.element( document.querySelectorAll( 'ion-header-bar' ) ).removeClass( 'espm-header-tabs' );
        this.detranApiService.syncVehicleData();
    }

    /**
     * 
     * 
     * @readonly
     * @type {Vehicle[]}
     * @memberOf VehiclesController
     */
    public get vehicles(): Vehicle[] {
        return this.vehicleStorage.vehiclesData.vehicles;
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     */
    public openRemoveVehicleModal( vehicle: Vehicle ) {
        this.dialog.confirm( { title: `Deseja remover o veículo com placa: ${vehicle.plate}?` })
            .then(() => this.removeVehicle( vehicle ) );
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     * 
     * @memberOf VehiclesController
     */
    public removeVehicle( vehicle: Vehicle ) {
        if ( !this.editing ) {
            return;
        }

        let vehicles = this.vehicleStorage.removeVehicle( vehicle );
        this.detranApiService.syncVehicleData( true );

        // sai do modo de edição se não resta nenhum veículo
        if ( !vehicles.vehicles.length ) {
            this.editing = false;
        }
    }

    /**
     * 
     */
    public openAddVehicleModal(): void {
        this.$mdDialog.show( {
            controller: AddVehicleController,
            template: addVehicleTemplate,
            bindToController: true,
            controllerAs: 'vm'
        })
            .then(( vehicle: Vehicle ) => this.addVehicle( vehicle ) );
    }


    /**
     * 
     * 
     * @param {Vehicle} vehicle
     * @returns
     * 
     * @memberOf VehiclesController
     */
    public addVehicle( vehicle: Vehicle ) {
        if ( this.vehicleStorage.existsVehicle( vehicle ) ) {
            this.toast.error( { title: 'Placa ou RENAVAM já cadastrado(s)' }); return;
        }

        this.detranApiService
            .getVehicleInfo( vehicle )
            .then(( info: VehicleInfo ) => {
                vehicle.info = info;
                this.vehicleStorage.addVehicle( vehicle );
                this.detranApiService.syncVehicleData( true );
                return vehicle;
            })
            .catch(( error ) => {
                // Caso o veículo não exista 404
                if ( error.status === 404 ) {
                    this.toast.error( { title: 'Veículo não encontrado na base do DETRAN.' }); return;
                } else {
                    this.toast.error( { title: 'Erro ao salvar veículo. Tente novamente' }); return;
                }
            });
    }

    /**
     * 
     */
    public viewTickets( vehicle: Vehicle ) {
        this.transitionService.changeState( 'app.vehicleTickets/:plate/:renavam', vehicle, { type: 'slide', direction: 'left' });
    }
}
