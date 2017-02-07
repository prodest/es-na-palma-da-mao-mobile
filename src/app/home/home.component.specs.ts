import { HomeController } from './home.component.controller';
import { HomeComponent } from './home.component';
import HomeTemplate = require( './home.component.html' );
import { TransitionService } from '../shared/shared.module';
import { AuthenticationService } from '../security/security.module';
import { settings } from '../shared/shared.module';

let expect = chai.expect;

describe( 'Home', () => {
    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: HomeController;
        let transitionService: TransitionService;
        let authenticationService: AuthenticationService;

        beforeEach(() => {
            transitionService = <TransitionService><any>{
                changeState: () => { }
            };

            authenticationService = <AuthenticationService>{};

            controller = new HomeController( transitionService, authenticationService, settings );
        });

        describe( 'navigateToLogin()', () => {
            it( 'should redirect user to login screen', () => {
                let changeState = sandbox.stub( transitionService, 'changeState' );

                controller.navigateToLogin();

                expect( changeState.calledWith( 'login' ) ).to.be.true;
            });
        });
    });

    describe( 'Component', () => {
        // test the component/directive itself
        let component = HomeComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( HomeController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( HomeTemplate );
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
