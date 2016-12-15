
import { DashBoardController } from './dashboard.component.controller';
import { DashBoardComponent } from './dashboard.component';
import DashBoardTemplate = require('./dashboard.component.html');
import { environment } from '../shared/tests/index';
import { TransitionService } from '../shared/shared.module';

let expect = chai.expect;

describe( 'Dashboard', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: DashBoardController;
        let $ionicTabsDelegate: ionic.tabs.IonicTabsDelegate;
        let transitionService: TransitionService;

        beforeEach(() => {
            environment.refresh();
            controller = new DashBoardController( $ionicTabsDelegate, transitionService );
        });
    });

    describe( 'Component', () => {
        // test the component/directive itself
        let component = DashBoardComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( DashBoardController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( DashBoardTemplate );
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
