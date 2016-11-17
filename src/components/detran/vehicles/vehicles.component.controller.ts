import { IScope } from 'angular';
import { Vehicle, VehicleStorage } from '../shared/index';
import { DialogService, ToastService, TransitionService } from '../../shared/index';
import { AddVehicleController } from './add-vehicle/add-vehicle.controller';
import addVehicleTemplate = require( './add-vehicle/add-vehicle.html' );

/**
 * 
 * 
 * @export
 * @class VehiclesController
 */
export class VehiclesController {

    public static $inject: string[] = [ '$scope', '$mdDialog', 'toast', 'dialog', 'detranStorage', 'transitionService' ];

    public editing: boolean = false;

    /**
     * Creates an instance of VehiclesController.
     * 
     * @param {IScope} $scope
     * @param {angular.material.IDialogService} $mdDialog,
     * @param {ToastService} toast
     * @param {DialogService} dialog
     * @param {} vehicleStorage
     * 
     * @memberOf VehiclesController
     */
    constructor( private $scope: IScope,
        private $mdDialog: angular.material.IDialogService,
        private toast: ToastService,
        private dialog: DialogService,
        private vehicleStorage: VehicleStorage,
        private transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     * 
     */
    public activate() {
        this.vehicleStorage.sync();
    }

    /**
     * 
     * 
     * @readonly
     * @type {Vehicle[]}
     * @memberOf VehiclesController
     */
    public get vehicles(): Vehicle[] {
        return this.vehicleStorage.vehicles;
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     * @returns
     * 
     * @memberOf VehiclesController
     */
    public removeVehicle( vehicle: Vehicle ) {
        if ( !this.editing ) { return; }

        try {
            let vehicles = this.vehicleStorage.removeVehicle( vehicle );
            this.editing = vehicles.length > 0; // sai do modo de edição se não resta nenhum veículo
        } catch ( error ) {
            this.toast.error( { title: 'Erro ao remover veículo.' });
        };
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     * @returns
     * 
     * @memberOf VehiclesController
     */
    public async addVehicle( vehicle: Vehicle ) {
        try {
            // todo
            if ( this.vehicleStorage.containsVehicle( vehicle ) ) {
                this.toast.error( { title: 'Placa ou RENAVAM já cadastrado(s)' }); return;
            }
            await this.vehicleStorage.addVehicle( vehicle );
        } catch ( error ) {
            if ( error.status === 404 ) {
                this.toast.error( { title: 'Veículo não encontrado na base do DETRAN.' });
            } else {
                this.toast.error( { title: 'Erro ao salvar veículo. Tente novamente' });
            }
        };
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     * 
     * @memberOf VehiclesController
     */
    public viewTickets( vehicle: Vehicle ) {
        this.transitionService.changeState( 'app.vehicleTickets/:plate/:renavam', vehicle, { type: 'slide', direction: 'left' });
    }

    /**
     * 
     * 
     * 
     * @memberOf VehiclesController
     */
    public openAddVehicleModal() {
        const options = {
            controller: AddVehicleController,
            template: addVehicleTemplate,
            bindToController: true,
            controllerAs: 'vm'
        };
        this.$mdDialog.show( options )
            .then( vehicle => {
                this.addVehicle( vehicle );
            });
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     */
    public async openRemoveVehicleModal( vehicle: Vehicle ) {
        const confirm = await this.dialog.confirm( { title: `Deseja remover o veículo com placa: ${vehicle.plate}?` });

        if ( confirm ) {
            this.removeVehicle( vehicle );
        }
    }
}
