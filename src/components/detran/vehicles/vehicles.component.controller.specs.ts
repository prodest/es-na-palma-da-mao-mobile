import { VehiclesController } from './vehicles.component.controller';
import VehiclesComponent from './vehicles.component';
import VehiclesTemplate = require('./vehicles.component.html');
import { Vehicle, VehicleStorage, DetranApiService, VehicleInfo, VehicleData } from '../shared/index';
import { TransitionService } from '../../shared/index';
import addVehicleTemplate = require('./add-vehicle/add-vehicle.html');
import { AddVehicleController } from './add-vehicle/add-vehicle.controller';
import { environment, $mdDialogMock, dialogServiceMock, toastServiceMock } from '../../shared/tests/index';
let expect = chai.expect;

describe( 'Detran/vehicles', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: VehiclesController;

        // dialogs
        let dialogConfirm: Sinon.SinonStub;
        let dialogConfirmPromise: Sinon.SinonPromise;
        let toastError: Sinon.SinonStub;
        let $mdDialogShow: Sinon.SinonStub;
        let $mdDialogShowPromise: Sinon.SinonPromise;

        // storage
        let storageRemoveVehicle: Sinon.SinonStub;
        let storageExistsVehicle: Sinon.SinonStub;
        let storageAddVehicle: Sinon.SinonStub;

        // api
        let getVehicleInfoApi: Sinon.SinonStub;
        let getVehicleInfoApiPromise: Sinon.SinonPromise;
        let syncVehicleDataApi: Sinon.SinonStub;
        let syncVehicleDataApiPromise: Sinon.SinonPromise;

        // Services
        let transitionService: TransitionService;
        let changeState: Sinon.SinonStub;

        // models
        let vehicle: Vehicle;
        let vehicleInfo: VehicleInfo;
        let vehicleData: VehicleData;
        let vehicleStorage: VehicleStorage;

        beforeEach(() => {
            environment.refresh();
            vehicleStorage = <VehicleStorage><any>{
                existsVehicle() { },
                removeVehicle() { },
                addVehicle() { }
            };

            let detranApiService = <DetranApiService><any>{
                getVehicleInfo() { },
                syncVehicleData() { }
            };

            transitionService = <TransitionService><any>{
                changeState: () => { }
            };

            controller = new VehiclesController( environment.$scope, $mdDialogMock, detranApiService, toastServiceMock, dialogServiceMock, vehicleStorage, transitionService );

            // setup stubs
            vehicle = { plate: '123456', renavam: 333333 };
            vehicleInfo = { color: 'red', model: 'Idea' };
            vehicleData = { id: 9232, vehicles: [ vehicle, vehicle ], date: new Date() };
            vehicleStorage.vehiclesData = vehicleData;

            storageExistsVehicle = sandbox.stub( vehicleStorage, 'existsVehicle' );
            storageAddVehicle = sandbox.stub( vehicleStorage, 'addVehicle' );
            storageRemoveVehicle = sandbox.stub( vehicleStorage, 'removeVehicle' ).returns( vehicleData );

            dialogConfirm = sandbox.stub( dialogServiceMock, 'confirm' );
            dialogConfirmPromise = dialogConfirm.returnsPromise();
            $mdDialogShow = sandbox.stub( $mdDialogMock, 'show' );
            $mdDialogShowPromise = $mdDialogShow.returnsPromise();
            toastError = sandbox.stub( toastServiceMock, 'error' );

            getVehicleInfoApi = sandbox.stub( detranApiService, 'getVehicleInfo' );
            getVehicleInfoApiPromise = getVehicleInfoApi.returnsPromise();

            changeState = sandbox.stub( transitionService, 'changeState' );

            syncVehicleDataApi = sandbox.stub( detranApiService, 'syncVehicleData' );
            syncVehicleDataApiPromise = syncVehicleDataApi.returnsPromise();
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
            it( 'should call syncVehicleData', () => {
                controller.activate();

                expect( syncVehicleDataApi.calledOnce ).to.be.true;
            });
        });

        describe( 'vehicles', () => {
            it( 'should return vehicles from local storage', () => {
                expect( controller.vehicles ).to.be.deep.equal( vehicleStorage.vehiclesData.vehicles );
            });
        });

        describe( 'openRemoveVehicleModal(vehicle)', () => {
            it( 'should show confirm dialog', () => {
                controller.openRemoveVehicleModal( vehicle );

                expect( dialogConfirm.calledWith( { title: `Deseja remover o veículo com placa: ${vehicle.plate}?` }) ).to.be.true;
            });

            it( 'should remove vehicle if confirm exclusion', () => {
                let removeVehicle = sandbox.stub( controller, 'removeVehicle' ); // 
                dialogConfirmPromise.resolves();

                controller.openRemoveVehicleModal( vehicle );

                expect( removeVehicle.calledWithExactly( vehicle ) ).to.be.true;
            });

            it( 'should not remove vehicle on cancel', () => {
                let removeVehicle = sandbox.stub( controller, 'removeVehicle' );
                $mdDialogShowPromise.rejects();

                controller.openRemoveVehicleModal( vehicle );

                expect( removeVehicle.notCalled );
            });
        });

        describe( 'removeVehicle(vehicle)', () => {
            beforeEach(() => {
                controller.editing = true;
            });

            it( 'should remove vehicle from local storage if in edit mode', () => {
                controller.removeVehicle( vehicle );

                expect( storageRemoveVehicle.calledWithExactly( vehicle ) ).to.be.true;
            });

            it( 'should sync with backend after remove', () => {
                controller.removeVehicle( vehicle );

                expect( syncVehicleDataApi.calledWithExactly( true ) ).to.be.true;
            });

            it( 'should not remove vehicle from local storage if not in edit mode', () => {
                controller.editing = false;

                controller.removeVehicle( vehicle );

                expect( storageRemoveVehicle.notCalled ).to.be.true;
            });

            it( 'should exit edit mode if no vehicles remains stored', () => {
                let vehicleDataEmpty = vehicleData;
                vehicleDataEmpty.vehicles = [];

                storageRemoveVehicle.returns( vehicleDataEmpty );

                controller.removeVehicle( vehicle );

                expect( controller.editing ).to.be.false;
            });

            it( 'should not exit edit mode if some vehicles remains stored', () => {
                storageRemoveVehicle.returns( vehicleData );

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
                controller.openAddVehicleModal();

                expect( $mdDialogShow.calledWithExactly( {
                    controller: AddVehicleController,
                    template: addVehicleTemplate,
                    bindToController: true,
                    controllerAs: 'vm'
                }) );
            });

            it( 'should add new vehicle on confirm', () => {
                let addVehicle = sandbox.stub( controller, 'addVehicle' );
                $mdDialogShowPromise.resolves( vehicle );

                controller.openAddVehicleModal();

                expect( addVehicle.calledWithExactly( vehicle ) );
            });

            it( 'should not add new vehicle on cancel', () => {
                let addVehicle = sandbox.stub( controller, 'addVehicle' );
                $mdDialogShowPromise.rejects();

                controller.openAddVehicleModal();

                expect( addVehicle.notCalled );
            });
        });

        describe( 'addVehicle(vehicle)', () => {
            it( 'should show error if vehicle is already stored', () => {
                storageExistsVehicle.returns( true );

                controller.addVehicle( vehicle );

                expect( toastError.calledWithExactly( { title: 'Placa ou RENAVAM já cadastrado(s)' }) ).to.be.true;
                expect( getVehicleInfoApi.notCalled ).to.be.true;

            });

            it( 'should sync with backend after add', () => {
                storageExistsVehicle.returns( false );
                getVehicleInfoApiPromise.resolves( vehicleInfo );

                controller.addVehicle( vehicle );

                expect( syncVehicleDataApi.calledWithExactly( true ) ).to.be.true;
            });

            it( 'should fill vehicle info and add it to local storage if not stored', () => {
                storageExistsVehicle.returns( false );
                getVehicleInfoApiPromise.resolves( vehicleInfo );

                controller.addVehicle( vehicle );

                expect( vehicle.info ).to.be.deep.equal( vehicleInfo );
                expect( storageAddVehicle.calledWithExactly( vehicle ) ).to.be.true;
            });

            it( 'should show message on error', () => {
                storageExistsVehicle.returns( false );
                getVehicleInfoApiPromise.rejects( { status: 500 });

                controller.addVehicle( vehicle );

                expect( toastError.calledWithExactly( { title: 'Erro ao salvar veículo. Tente novamente' }) ).to.be.true;
            });

            it( 'should show error message if vehicle info not founded', () => {
                storageExistsVehicle.returns( false );
                getVehicleInfoApiPromise.rejects( { status: 404 });

                controller.addVehicle( vehicle );

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
