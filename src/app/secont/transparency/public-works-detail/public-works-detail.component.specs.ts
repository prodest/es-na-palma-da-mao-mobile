import { PublicWorksDetailController } from './public-works-detail.component.controller';
import { PublicWorksDetailComponent } from './public-works-detail.component';
import PublicWorksDetailTemplate = require( './public-works-detail.component.html' );

let expect = chai.expect;

describe( 'PublicWorksDetail', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Component', () => {
        // test the component/directive itself
        let component = PublicWorksDetailComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( PublicWorksDetailController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( PublicWorksDetailTemplate );
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
