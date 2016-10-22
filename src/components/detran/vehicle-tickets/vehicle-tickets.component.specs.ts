import { VehicleTicketsController } from './vehicle-tickets.component.controller';
import VehicleTicketsComponent from './vehicle-tickets.component';
import VehicleTicketsTemplate = require('./vehicle-tickets.component.html');
import { DetranApiService, TicketColorService, Ticket } from '../shared/index';
import { environment, $stateParamsMock } from '../../shared/tests/index';

let expect = chai.expect;

describe( 'Detran/vehicle-tickets', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {

        let controller: VehicleTicketsController;
        let detranApiService: DetranApiService;
        let ticketColorService: TicketColorService;

        beforeEach(() => {
            environment.refresh();
            $stateParamsMock[ 'plate' ] = 'OBL9090';
            $stateParamsMock[ 'renavam' ] = '123343545676';

            detranApiService = <DetranApiService><any>{ getVehicleTickets() { } };
            ticketColorService = new TicketColorService();

            controller = new VehicleTicketsController( environment.$scope, $stateParamsMock, ticketColorService, detranApiService );
        });

        afterEach(() => {
            delete $stateParamsMock[ 'plate' ];
            delete $stateParamsMock[ 'renavam' ];
        });

        describe( 'on instantiation', () => {
            it( 'should activate on $ionicView.beforeEnter event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                environment.onIonicBeforeEnterEvent();

                expect( activate.calledOnce ).to.be.true;
            });

            it( 'tickets should be "undefined"', () => {
                expect( controller.tickets ).to.be.undefined;
            });

            it( 'should fill vehicle with params data', () => {
                expect( controller.vehicle ).to.be.deep.equal( $stateParamsMock );
            });
        });

        describe( 'activate()', () => {
            it( 'should get vehicle tickets', () => {
                let getVehicleTickets = sandbox.stub( controller, 'getVehicleTickets' );

                controller.activate();

                expect( getVehicleTickets.calledWithExactly( controller.vehicle ) ).to.be.true;
            });
        });


        describe( 'getTicketLevelColor()', () => {
            it( 'should call "ticketColorService.getTicketLevelColor()"', () => {
                let getTicketLevelColor = sandbox.stub( ticketColorService, 'getTicketLevelColor' );
                let level = 'leve';

                controller.getTicketLevelColor( level );

                expect( getTicketLevelColor.calledWith( level ) ).to.be.true;
            });
        });

        describe( 'getVehicleTickets()', () => {

            let getVehicleTicketsApi: Sinon.SinonPromise;
            let tickets: Ticket[] = [ {
                classification: 'MÉDIA',
                date: new Date(),
                description: 'ESTACIONAR O VEÍCULO EM LOCAIS E HORÁRIOS PROIBIDOS ESPECIFICAMENTE PELA SINALIZAÇÃO (PLACA - PROIBIDO ESTACIONAR).',
                district: 'VITORIA',
                place: 'R. DR. MOACYR GONCALVES',
                plate: 'MQH9400',
                points: 4,
                warning: false
            }];

            beforeEach(() => {
                getVehicleTicketsApi = sandbox.stub( detranApiService, 'getVehicleTickets' ).returnsPromise();
                getVehicleTicketsApi.resolves( tickets );
            });

            it( 'should populate tickets property', () => {
                controller.getVehicleTickets( controller.vehicle );
                expect( controller.tickets ).to.be.deep.equal( tickets );
            });

            it( 'should set tickets property to undefined on error', () => {
                controller.tickets = tickets;
                getVehicleTicketsApi.rejects();
                controller.getVehicleTickets( controller.vehicle ).then(() => {
                    expect( controller.tickets ).to.be.undefined;
                });
            });
        });

        describe( 'ticketsFounded', () => {
            it( 'should return true if has tickets', () => {
                controller.tickets = <Ticket[]>[ {}];
                expect( controller.ticketsFounded ).to.be.true;
            });

            it( 'should return false if has no tickets', () => {
                controller.tickets = [];
                expect( controller.ticketsFounded ).to.be.false;
            });

            it( 'should return false if tickets is undefined', () => {
                controller.tickets = undefined;
                expect( controller.ticketsFounded ).to.be.false;
            });
        });

        describe( 'ticketsNotFounded', () => {
            it( 'should return false if has tickets', () => {
                controller.tickets = <Ticket[]>[ {}];
                expect( controller.ticketsNotFounded ).to.be.false;
            });

            it( 'should return true if has no tickets', () => {
                controller.tickets = [];
                expect( controller.ticketsNotFounded ).to.be.true;
            });

            it( 'should return false if tickets is undefined', () => {
                controller.tickets = undefined;
                expect( controller.ticketsFounded ).to.be.false;
            });
        });
    });

    describe( 'Component', () => {
        // test the component/directive itself
        let component = VehicleTicketsComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( VehicleTicketsController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( VehicleTicketsTemplate );
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
