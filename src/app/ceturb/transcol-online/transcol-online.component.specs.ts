import { TranscolOnlineController } from './transcol-online.component.controller';
import { TranscolOnlineComponent } from './transcol-online.component';
import { TranscolOnlineApiService } from './shared/index';
import TranscolOnlineTemplate = require( './transcol-online.component.html' );
import { environment, $windowMock } from '../../shared/tests/index';

let expect = chai.expect;

describe( 'TranscolOnline', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: TranscolOnlineController;
        let apiAservice: TranscolOnlineApiService;
        beforeEach(() => {
            environment.refresh();
            apiAservice = <TranscolOnlineApiService>{};
            controller = new TranscolOnlineController( environment.$scope, $windowMock, {} as any, {} as any, {} as any, apiAservice );
        });
    });


    describe( 'Component', () => {
        // test the component/directive itself
        let component = TranscolOnlineComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( TranscolOnlineController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( TranscolOnlineTemplate );
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
