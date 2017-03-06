import { BusStopsController } from './bus-stops.component.controller';
import { BusStopsComponent } from './bus-stops.component';
import { CeturbApiService } from '../shared/index';
import BusStopsTemplate = require( './bus-stops.component.html' );
import { environment } from '../../shared/tests/index';

let expect = chai.expect;

describe( 'BusStops', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: BusStopsController;
        let ceturbApiService: CeturbApiService;
        beforeEach(() => {
            environment.refresh();
            ceturbApiService = <CeturbApiService>{};
            controller = new BusStopsController( environment.$scope, ceturbApiService );
        });
    });


    describe( 'Component', () => {
        // test the component/directive itself
        let component = BusStopsComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( BusStopsController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( BusStopsTemplate );
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
