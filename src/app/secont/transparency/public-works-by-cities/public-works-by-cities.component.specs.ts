import { PublicWorksByCitiesController } from './public-works-by-cities.component.controller';
import { PublicWorksByCitiesComponent } from './public-works-by-cities.component';
import PublicWorksByCitiesTemplate = require( './public-works-by-cities.component.html' );

let expect = chai.expect;

describe( 'Public Works By City', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );


    describe( 'Component', () => {
        // test the component/directive itself
        let component = PublicWorksByCitiesComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( PublicWorksByCitiesController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( PublicWorksByCitiesTemplate );
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
