import { PublicWorksController } from './public-works.component.controller';
import { PublicWorksComponent } from './public-works.component';
import PublicWorksTemplate = require( './public-works.component.html' );

let expect = chai.expect;

describe( 'Public Works By City', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );


    describe( 'Component', () => {
        // test the component/directive itself
        let component = PublicWorksComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( PublicWorksController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( PublicWorksTemplate );
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
