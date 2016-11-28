import { DriverLicenseComponent } from './driver-license.component';
import DriverLicenseTemplate = require('./driver-license.component.html');
import registerLicenseTemplate = require('../shared/add-license/add-license.html');
import { AddLicenseController } from '../shared/add-license/add-license.controller';
import { DriverLicenseController } from './driver-license.component.controller';
import { DriverLicense, DriverLicenseStorage, DetranApiService } from '../shared/index';
import { TransitionService } from '../../shared/shared.module';
import driverLicenseImgUrl = require ('./img/cnh-frente.jpg');
import { environment, $mdDialogMock } from '../../shared/tests/index';

let expect = chai.expect;

describe( 'Detran/driver-license', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let detranApiService: DetranApiService;
        let controller: DriverLicenseController;
        let driverLicenseStorage: DriverLicenseStorage;
        let transitionService: TransitionService;

        beforeEach(() => {
            environment.refresh();
            driverLicenseStorage = <DriverLicenseStorage>{
                hasDriverLicense: false
            };
            detranApiService = <DetranApiService><any>{
                getDriverData() { },
                getDriverTickets() { },
                saveLicense() { }
            };
            transitionService = <TransitionService><any>{
                changeState: () => { }
            };
            controller = new DriverLicenseController(
                environment.$scope,
                detranApiService,
                driverLicenseStorage,
                $mdDialogMock,
                transitionService );
        });

        describe( 'on instantiation', () => {
            it( 'should activate on $ionicView.beforeEnter event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                environment.onIonicBeforeEnterEvent();

                expect( activate.calledOnce ).to.be.true;
            });

            it( 'imgLicense should be "undefined"', () => {
                expect( controller.imgLicense ).to.be.undefined;
            });
        });

        describe( 'activate()', () => {
            it( 'imgLicense === imgDriverLicense.src', () => {
                controller.activate();
                expect( controller.imgLicense ).to.be.equal( driverLicenseImgUrl );
            });

            it( 'should redirect to "app.driverLicenseStatus" if hasDriverLicense === true', () => {
                let navigateTo = sandbox.stub( controller, 'navigateTo' );
                driverLicenseStorage.hasDriverLicense = true;

                controller.activate();

                expect( navigateTo.calledWith( 'app.driverLicenseStatus' ) ).to.be.true;
            });

            it( 'should not redirect to "app.driverLicenseStatus" if hasDriverLicense === false', () => {
                let navigateTo = sandbox.stub( controller, 'navigateTo' );
                driverLicenseStorage.hasDriverLicense = false;

                controller.activate();

                expect( navigateTo.notCalled ).to.be.true;
            });
        });

        describe( 'hasDriverLicense', () => {
            it( 'should reflect driverLicenseStorage.hasDriverLicense', () => {
                driverLicenseStorage.hasDriverLicense = false;
                expect( controller.hasDriverLicense ).to.equal( driverLicenseStorage.hasDriverLicense );

                driverLicenseStorage.hasDriverLicense = true;
                expect( controller.hasDriverLicense ).to.equal( driverLicenseStorage.hasDriverLicense );
            });
        });

        describe( 'registerLicense()', () => {
            let $mdDialogShow: Sinon.SinonStub;

            beforeEach(() => {
                $mdDialogShow = sandbox.stub( $mdDialogMock, 'show' );
                $mdDialogShow.returnsPromise();
            });

            it( 'should open add license modal', () => {
                driverLicenseStorage.driverLicense = { registerNumber: '234234343', ballot: '45345455' };
                controller.registerLicense();

                expect( $mdDialogShow.calledWithExactly( {
                    controller: AddLicenseController,
                    template: registerLicenseTemplate,
                    bindToController: true,
                    controllerAs: 'vm',
                    locals: {
                        registerNumber: Number( driverLicenseStorage.driverLicense.registerNumber ),
                        ballot: Number( driverLicenseStorage.driverLicense.ballot )
                    }
                }) ).to.be.true;
            });

            describe( 'on driver license added', () => {
                let saveLicense: Sinon.SinonStub;
                let addedDriverLicense: DriverLicense;
                let navigateTo: Sinon.SinonStub;

                beforeEach(() => {
                    driverLicenseStorage.driverLicense = <DriverLicense>{};
                    navigateTo = sandbox.stub( controller, 'navigateTo' );
                    saveLicense = sandbox.stub( detranApiService, 'saveLicense' );
                    saveLicense.returnsPromise().resolves();
                    addedDriverLicense = { registerNumber: '00000000', ballot: '9999999' };
                    $mdDialogShow.returnsPromise().resolves( addedDriverLicense );
                });

                it( 'should save new license on server', () => {
                    controller.registerLicense();
                    expect( saveLicense.calledWith( addedDriverLicense ) ).to.be.true;
                });

                it( 'should save new license on local storage', () => {
                    controller.registerLicense();
                    expect( driverLicenseStorage.driverLicense ).to.be.deep.equal( addedDriverLicense );
                });

                it( 'should reload screen', () => {
                    controller.registerLicense();
                    expect( navigateTo.calledWith( 'app.driverLicenseStatus' ) ).to.be.true;
                });
            });

            describe( 'navigateTo(state)', () => {
                it( 'should change state using TransitionService', () => {
                    let changeState = sandbox.stub( transitionService, 'changeState' );

                    controller.navigateTo( 'someState' );

                    expect( changeState.calledWithExactly( 'someState', {}, { type: 'slide', direction: 'up' }, true ) ).to.be.true;
                });
            });
        });
    });

    describe( 'Component', () => {
        let component = DriverLicenseComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( DriverLicenseController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( DriverLicenseTemplate );
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
