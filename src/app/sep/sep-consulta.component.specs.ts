import { SocialSharing, BarcodeScanner } from 'ionic-native';
import { SepConsultaComponent } from './sep-consulta.component';
import { SepApiService, Process, SepStorageService } from './shared/index';
import { SepConsultaController } from './sep-consulta.component.controller';
import { environment, toastServiceMock, $stateParamsMock } from '../shared/tests/index';
import { AuthenticationService } from '../security/security.module';
import SepConsultaTemplate = require('./sep-consulta.component.html');

let expect = chai.expect;

describe( 'SEP/sep-consulta', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: SepConsultaController;
        let sepApiService: SepApiService;
        let authenticationService: AuthenticationService;
        let $mdDialog: angular.material.IDialogService;
        let sepStorageService: SepStorageService;
        let $ionicScrollDelegate;
        let processNumber = '68985037';

        let process: Process = <Process>{
            number: '68985037',
            status: 'EM ANDAMENTO',
            updates: [
                {
                    date: '22/01/2015 08:56:00',
                    agency: 'INSTITUTO DE TECNOLOGIA DE INFORMACAO E COMUNICACAO DO ESTADO DO ESPIRITO SANTO',
                    area: 'GERENCIA DE SISTEMAS DE INFORMACAO',
                    status: 'EM ANDAMENTO'
                },
                {
                    date: '14/01/2015 11:31:40',
                    agency: 'INSTITUTO DE TECNOLOGIA DE INFORMACAO E COMUNICACAO DO ESTADO DO ESPIRITO SANTO',
                    area: 'GERENCIA DE ADMINISTRACAO GERAL',
                    status: 'AUTUADO'
                }
            ]
        };

        beforeEach(() => {
            environment.refresh();
            $ionicScrollDelegate = <ionic.scroll.IonicScrollDelegate><any> {
                scrollTo: sandbox.stub().returnsPromise().resolves()
            };

            sepApiService = <SepApiService><any>{
                getProcessByNumber: () => { }
            };

            controller = new SepConsultaController( 
                environment.$scope, 
                $ionicScrollDelegate, 
                $stateParamsMock, 
                toastServiceMock, 
                sepApiService,
                authenticationService,
                $mdDialog,
                sepStorageService );
        });

        describe( 'on instanciation', () => {
            it( 'should activate on $ionicView.loaded event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                environment.onIonicLoadedEvent();

                expect( activate.called ).to.be.true;
            });
        });

        describe( 'activate()', () => {
            let getProcess: Sinon.SinonStub;

            beforeEach(() => {
                getProcess = sandbox.stub( controller, 'getProcess' );
            });

            it( 'should have an undefined process', async () => {
                await controller.activate();

                expect( controller.process ).to.be.undefined;
            });

            it( 'should have empty process number', async () => {
                await controller.activate();

                expect( controller.processNumberModel ).to.be.empty;
            });

            it( 'should have empty last process number', async () => {
                await controller.activate();

                expect( controller.lastProcessNumber ).to.be.empty;
            });

            it( 'should hot have been searched', async () => {
                await controller.activate();

                expect( controller.searched ).to.be.false;
            });

            it( 'should hide all updates', async () => {
                await controller.activate();

                expect( controller.showAllUpdates ).to.be.false;
            });

            it( 'should get process if has stateParam processNumber', async () => {
                $stateParamsMock[ 'processNumber' ] = '4545';

                await controller.activate();

                delete $stateParamsMock[ 'processNumber' ];

                expect( getProcess.called ).to.be.true;
            });

            it( 'should set processNumberModel if has stateParam processNumber', async () => {
                $stateParamsMock[ 'processNumber' ] = '4545';

                await controller.activate();

                delete $stateParamsMock[ 'processNumber' ];

                expect( controller.processNumberModel ).to.be.equal( 4545 );
            });

            it( 'should not get process if stateParam empty', async () => {
                await controller.activate();

                expect( getProcess.called ).to.be.false;
            });

            it( 'should not set processNumber if stateParam empty', async () => {
                await controller.activate();

                expect( controller.processNumberModel ).to.be.equal( undefined );
            });
        });

        describe( 'scanBarcode()', () => {

            let getProcess: Sinon.SinonStub;
            let scan: Sinon.SinonStub;
            let scanPromise: Sinon.SinonPromise;

            beforeEach( () => {
                getProcess = sandbox.stub( controller, 'getProcess' );
                scan = sandbox.stub( BarcodeScanner, 'scan' );
                scanPromise = scan.returnsPromise();
                scanPromise.resolves();
            });

            it( 'should get process with readed code', async () => {
                let objCode = { text: '984651981' };
                scanPromise.resolves( objCode );

                await controller.scanBarcode();

                expect( getProcess.calledWithExactly( objCode.text ) ).to.be.true;
            });

            it( 'should not get process when returned text is empty', async () => {
                let objCode = { text: '' };
                scanPromise.resolves( objCode );

                await controller.scanBarcode();

                expect( getProcess.called ).to.be.false;
            });

            it( 'should open scan with provided options', async () => {
                await controller.scanBarcode();

                expect( scan.calledWithExactly( {
                    'preferFrontCamera': false, // iOS and Android
                    'prompt': 'Posicione o código dentro da área de leitura', // supported on Android only
                    'format': 'CODE_39'
                }) ).to.be.true;
            });

            it( 'should show error message on error', async () => {
                let error = sandbox.stub( toastServiceMock, 'error' );

                scanPromise.rejects();

                await controller.scanBarcode();

                expect( error.calledWithExactly( { title: 'Não foi possível ler o código do processo' }) ).to.be.true;
            });
        });

        describe( 'getProcess( number )', () => {

            let getProcessByNumber: Sinon.SinonStub;

            beforeEach(() => {
                getProcessByNumber = sandbox.stub( sepApiService, 'getProcessByNumber' );
                getProcessByNumber.returnsPromise().resolves( process );
            });

            it( 'should show validation message if no process number is provided', async () => {
                let info = sandbox.stub( toastServiceMock, 'info' ); // replace original activate

                await controller.getProcess( undefined );

                expect( info.calledWith( { title: 'N° do processo é obrigatório' }) ).to.be.true;
                expect( getProcessByNumber.notCalled ).to.be.true;
            });

            describe( 'on success:', () => {
                it( 'should fill process property', async () => {
                    await controller.getProcess( processNumber );
                    expect( controller.process ).to.deep.equal( process );
                });

                it( 'should set searched to true', async () => {
                    await controller.getProcess( processNumber );
                    expect( controller.searched ).to.be.true;
                });

                it( 'should clear last process searched number', async () => {
                    controller.lastProcessNumber = '1232344';

                    await controller.getProcess( processNumber );

                    expect( controller.lastProcessNumber ).to.be.empty;
                });
            });

            describe( 'on error:', () => {

                beforeEach(() => {
                    getProcessByNumber.returnsPromise().rejects();
                });

                it( 'should unset process', async () => {
                    controller.process = process;

                    await controller.getProcess( processNumber );

                    expect( controller.process ).to.be.undefined;
                });

                it( 'should fill last process searched number', async () => {
                    controller.lastProcessNumber = '9999999999';

                    await controller.getProcess( processNumber );

                    expect( controller.lastProcessNumber ).to.be.equal( processNumber );
                });
            });
        });


        describe( 'share( process )', () => {
            it( 'should share process', () => {
                let shareWithOptions = sandbox.stub( SocialSharing, 'shareWithOptions' );

                controller.share( process );

                expect( shareWithOptions.calledWithExactly( {
                    message: `SEP - Processo ${process.number}`,
                    subject: `SEP - Processo ${process.number}`,
                    url: process.pageUrl
                }) ).to.be.true;
            });
        });

        describe( 'toggleUpdates()', () => {
            it( 'should invert showAllUpdates value', () => {
                let oldValue = controller.showAllUpdates;
                controller.toggleUpdates();
                expect( controller.showAllUpdates ).to.be.equal( !oldValue );
            });
        });

        describe( 'lastUpdate', () => {
            it( 'should return first update of process', () => {
                controller.process = process;
                expect( controller.lastUpdate ).to.deep.equal( controller.process.updates[ 0 ] );
            });

            it( 'should return undefined if has no process', () => {
                controller.process = undefined;
                expect( controller.lastUpdate ).to.be.undefined;
            });
        });

        describe( 'on enter pressed (onEnterPressed)', () => {
            it( 'should get process', () => {
                const getProcess = sandbox.stub( controller, 'getProcess' );

                controller.onEnterPressed( processNumber );

                expect( getProcess.calledWithExactly( processNumber ) ).to.be.true;
            });
        });
    });

    describe( 'Component', () => {
        // test the component/directive itself
        let component = SepConsultaComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( SepConsultaController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( SepConsultaTemplate );
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

