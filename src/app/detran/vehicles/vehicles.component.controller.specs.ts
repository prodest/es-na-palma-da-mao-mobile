import { VehiclesController } from './vehicles.component.controller';
import { VehiclesComponent } from './vehicles.component';
import VehiclesTemplate = require( './vehicles.component.html' );
import { Vehicle, VehicleStorage/* , VehicleInfo */ } from '../shared/index';
import { TransitionService } from '../../shared/shared.module';
import addVehicleTemplate = require( './add-vehicle/add-vehicle.html' );
import { AddVehicleController } from './add-vehicle/add-vehicle.controller';
import { environment, $mdDialogMock, dialogServiceMock, toastServiceMock } from '../../shared/tests/index';
let expect = chai.expect;

describe( 'Detran/vehicles', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: VehiclesController;
        let vehicles: Vehicle[];

        // dialogs
        let dialogConfirm: Sinon.SinonStub;
        let dialogConfirmPromise: Sinon.SinonPromise;
        let toastError: Sinon.SinonStub;
        let $mdDialogShow: Sinon.SinonStub;
        let $mdDialogShowPromise: Sinon.SinonPromise;

        // storage
        let vehicleStorage: VehicleStorage;

        // Services
        let transitionService: TransitionService;
        let changeState: Sinon.SinonStub;

        // models
        let vehicle: Vehicle;
        // let vehicleInfo: VehicleInfo;

        beforeEach(() => {
            environment.refresh();
            vehicleStorage = <VehicleStorage><any>{
                containsVehicle() { },
                removeVehicle() { },
                addVehicle() { },
                sync() { }
            };

            transitionService = <TransitionService><any>{
                changeState: () => { }
            };

            controller = new VehiclesController( environment.$scope, $mdDialogMock, toastServiceMock, dialogServiceMock, vehicleStorage, transitionService );

            // setup stubs
            vehicle = { plate: '123456', renavam: 333333 };
            // vehicleInfo = { color: 'red', model: 'Idea' };
            vehicles = [ vehicle, vehicle ];

            dialogConfirm = sandbox.stub( dialogServiceMock, 'confirm' );
            dialogConfirmPromise = dialogConfirm.returnsPromise();
            $mdDialogShow = sandbox.stub( $mdDialogMock, 'show' );
            $mdDialogShowPromise = $mdDialogShow.returnsPromise();
            toastError = sandbox.stub( toastServiceMock, 'error' );

            changeState = sandbox.stub( transitionService, 'changeState' );
        });

        describe( 'on instantiation', () => {
            it( 'should activate on $ionicView.beforeEnter event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                environment.onIonicBeforeEnterEvent();

                expect( activate.calledOnce ).to.be.true;
            });

            it( 'should not be in edit mode', () => {
                expect( controller.editing ).to.be.false;
            });
        });

        describe( 'on activate()', () => {
            it( 'should sync vehicle data', () => {
                const storageSync = sandbox.stub( vehicleStorage, 'sync' );

                controller.activate();

                expect( storageSync.calledOnce ).to.be.true;
            });
        });

        describe( 'vehicles', () => {
            it( 'should return vehicles from storage', () => {
                expect( controller.vehicles ).to.be.deep.equal( vehicleStorage.vehicles );
            });
        });

        describe( 'openRemoveVehicleModal(vehicle)', () => {
            it( 'should show confirm dialog', async () => {
                dialogConfirmPromise.resolves();

                await controller.openRemoveVehicleModal( vehicle );

                expect( dialogConfirm.calledWithExactly( { title: `Deseja remover o veículo com placa: ${vehicle.plate}?` }) ).to.be.true;
            });

            it( 'should remove vehicle if confirm exclusion', async () => {
                let removeVehicle = sandbox.stub( controller, 'removeVehicle' );
                dialogConfirmPromise.resolves( true );

                await controller.openRemoveVehicleModal( vehicle );

                expect( removeVehicle.calledWithExactly( vehicle ) ).to.be.true;
            });

            it( 'should not remove vehicle on cancel', async () => {
                let removeVehicle = sandbox.stub( controller, 'removeVehicle' );
                dialogConfirmPromise.resolves( false );

                await controller.openRemoveVehicleModal( vehicle );

                expect( removeVehicle.notCalled ).to.be.true;
            });
        });

        describe( 'removeVehicle(vehicle)', () => {

            let storageRemoveVehicle: Sinon.SinonStub;

            beforeEach(() => {
                storageRemoveVehicle = sandbox.stub( vehicleStorage, 'removeVehicle' );
                storageRemoveVehicle.returns( vehicles );
            });

            it( 'should remove vehicle from storage if in edit mode', () => {
                controller.editing = true;

                controller.removeVehicle( vehicle );

                expect( storageRemoveVehicle.calledWithExactly( vehicle ) ).to.be.true;
            });

            it( 'should not remove vehicle from local storage if not in edit mode', () => {
                controller.editing = false;

                controller.removeVehicle( vehicle );

                expect( storageRemoveVehicle.notCalled ).to.be.true;
            });

            it( 'should exit edit mode if no vehicles remains stored', () => {
                controller.editing = true;
                storageRemoveVehicle.returns( [] );

                controller.removeVehicle( vehicle );

                expect( controller.editing ).to.be.false;
            });

            it( 'should not exit edit mode if some vehicles remains stored', () => {
                controller.editing = true;
                storageRemoveVehicle.returns( vehicles );

                controller.removeVehicle( vehicle );

                expect( controller.editing ).to.be.true;
            });
        });

        describe( 'viewTickets( vehicle )', () => {
            it( 'should redirect user to "newState"', () => {
                controller.viewTickets( vehicle );

                expect( changeState.calledWithExactly( 'app.vehicleTickets/:plate/:renavam', vehicle, { type: 'slide', direction: 'left' }) ).to.be.true;
            });
        });

        describe( 'openAddVehicleModal()', () => {
            it( 'should open add vehicle modal', () => {
                sandbox.stub( controller, 'addVehicle' );
                $mdDialogShowPromise.resolves( vehicle );

                controller.openAddVehicleModal();

                expect( $mdDialogShow.calledWithExactly( {
                    controller: AddVehicleController,
                    template: addVehicleTemplate,
                    bindToController: true,
                    controllerAs: 'vm'
                }) ).to.be.true;
            });

            it( 'should add new vehicle on confirm', () => {
                let addVehicle = sandbox.stub( controller, 'addVehicle' );
                $mdDialogShowPromise.resolves( vehicle );

                controller.openAddVehicleModal();

                expect( addVehicle.calledWithExactly( vehicle ) ).to.be.true;
            });

            it( 'should not add new vehicle on cancel', () => {
                let addVehicle = sandbox.stub( controller, 'addVehicle' );
                $mdDialogShowPromise.rejects();

                controller.openAddVehicleModal();

                expect( addVehicle.notCalled ).to.be.true;
            });
        });

        describe( 'addVehicle(vehicle)', () => {

            let storageContainsVehicle: Sinon.SinonStub;
            let storageAddVehicle: Sinon.SinonStub;

            beforeEach(() => {
                storageContainsVehicle = sandbox.stub( vehicleStorage, 'containsVehicle' );
                storageAddVehicle = sandbox.stub( vehicleStorage, 'addVehicle' );
            });

            it( 'should show error if vehicle is already stored', async () => {
                storageContainsVehicle.returns( true );
                storageAddVehicle.returnsPromise().resolves( vehicles );

                await controller.addVehicle( vehicle );

                expect( toastError.calledWithExactly( { title: 'Placa ou RENAVAM já cadastrado(s)' }) ).to.be.true;
                expect( storageAddVehicle.notCalled ).to.be.true;

            });

            it( 'should show message on error', async () => {
                storageContainsVehicle.returns( false );
                storageAddVehicle.returnsPromise().rejects( { status: 500 });

                await controller.addVehicle( vehicle );

                expect( toastError.calledWithExactly( { title: 'Erro ao salvar veículo. Tente novamente' }) ).to.be.true;
            });

            it( 'should show error message if vehicle info not founded', async () => {
                storageContainsVehicle.returns( false );
                storageAddVehicle.returnsPromise().rejects( { status: 404 });

                await controller.addVehicle( vehicle );

                expect( toastError.calledWithExactly( { title: 'Veículo não encontrado na base do DETRAN.' }) ).to.be.true;
            });
        });

        describe( 'Component', () => {
            // test the component/directive itself
            let component = VehiclesComponent();

            it( 'should use the right controller', () => {
                expect( component.controller ).to.equal( VehiclesController );
            });

            it( 'should use the right template', () => {
                expect( component.template ).to.equal( VehiclesTemplate );
            });

            it( 'should use controllerAs', () => {
                expect( component ).to.have.property( 'controllerAs' );
            });

            it( 'should use controllerAs "vm"', () => {
                expect( component.controllerAs ).to.equal( 'vm' );
            });

            it( 'should use bindToController: true', () => {
                expect( component ).to.have.property( 'bindToController' );
                expect( component.bindToController ).to.equal( true );
            });
        });
    });
});
