import { PublicWorksByCityController } from './public-works-by-city.component.controller';
import { PublicWorksByCityComponent } from './public-works-by-city.component';
import PublicWorksByCityTemplate = require( './public-works-by-city.component.html' );

let expect = chai.expect;

describe( 'PublicWorksByCity', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Component', () => {
        // test the component/directive itself
        let component = PublicWorksByCityComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( PublicWorksByCityController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( PublicWorksByCityTemplate );
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
