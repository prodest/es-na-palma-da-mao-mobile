import { DashBoardController } from './dashboard.component.controller';
import DashBoardComponent from './dashboard.component';
import DashBoardTemplate = require('./dashboard.component.html');
import { environment } from '../shared/tests/index';
import { TransitionService } from '../shared/index';

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
            controller = new DashBoardController( environment.$scope, $ionicTabsDelegate, transitionService );
        });

        describe( 'on instantiation', () => {
            it( 'should activate on $ionicView.beforeEnter event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                environment.onIonicBeforeEnterEvent();

                expect( activate.called ).to.be.true;
            });
        });

        describe( 'activate()', () => {
            it( 'should apply "espm-header-tab" class to all "ion-header-bar" elements', () => {
                let domElement = { addClass: sinon.spy() };
                let querySelectorAll = sandbox.stub( document, 'querySelectorAll' );
                sandbox.stub( angular, 'element' ).returns( domElement );

                controller.activate();

                expect( querySelectorAll.calledWith( 'ion-header-bar' ) ).to.be.true;
                expect( domElement.addClass.calledWith( 'espm-header-tabs' ) ).to.be.true;
            });
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
