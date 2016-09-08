import { IScope, IPromise } from 'angular';
import { DetranApiService, Vehicle, VehicleStorage } from '../shared/index';
import { DialogService, ToastService } from '../../shared/index';

import addVehicleTemplate from './add-vehicle/add-vehicle.html';
import { AddVehicleController } from './add-vehicle/add-vehicle.controller';

/**
 * 
 * 
 * @export
 * @class VehiclesController
 */
export class VehiclesController {

    public static $inject: string[] = [ '$scope', '$mdDialog', '$state', 'detranApiService', 'dialog', 'toast', 'detranStorage' ];

    public vehicles: Vehicle[];
    public editing: boolean = false;

    /**
     * Creates an instance of VehiclesController.
     * 
     * @param {IScope} $scope
     * @param {angular.material.IDialogService} $mdDialog
     * @param {angular.material.IState} $state
     * @param {DetranApiService} detranApiService
     * @param {DialogService} dialog
     * @param {ToastService} toast
     * @param {VehicleStorage} vehicleStorage
     */
    constructor( private $scope: IScope,
        private $mdDialog: angular.material.IDialogService,
        private $state: angular.ui.IStateService,
        private detranApiService: DetranApiService,
        private dialog: DialogService,
        private toast: ToastService,
        private vehicleStorage: VehicleStorage ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     * 
     */
    public activate(): void {
        this.vehicles = this.vehicleStorage.vehicles;
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     */
    public removeVehicle( vehicle: Vehicle ) {
        this.dialog.confirm( { title: `Deseja remover o veículo com placa: ${vehicle.plate}?` } )
            .then( () => {
                this.vehicles = this.vehicleStorage.removeVehicle( vehicle );

                // sai do modo de edição se não resta nenhum veículo
                if ( !this.vehicles.length ) {
                    this.editing = false;
                }
            } );
    }

    /**
     * 
     */
    public addVehicle(): void {
        this.$mdDialog.show( {
            controller: AddVehicleController,
            template: addVehicleTemplate,
            bindToController: true,
            controllerAs: 'vm'
        } )
        .then( ( vehicle: Vehicle ) => {
            this.vehicles = this.vehicleStorage.addVehicle( vehicle );
        });
    }


    /**
     * 
     */
    public viewTickets( vehicle: Vehicle ) {
        this.$state.go( 'app.vehicleTickets/:plate/:renavam', vehicle );
    }
}