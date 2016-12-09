import { LoginComponent } from './login.component';
import { LoginController } from './login.component.controller';
import loginTemplate = require('./login.component.html');
import { TransitionService } from '../../shared/shared.module';
import { AuthenticationService } from '../shared/authentication.service';
import { environment, dialogServiceMock, toastServiceMock } from '../../shared/tests/index';

let expect = chai.expect;

describe( 'Login', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: LoginController;

        // declare stubs
        let toastInfo: Sinon.SinonStub;
        let toastError: Sinon.SinonStub;
        let authenticationService: AuthenticationService;
        let transitionServiceClearCache: Sinon.SinonStub;
        let transitionServiceChangeRootState: Sinon.SinonStub;

        beforeEach(() => {
            environment.refresh();
            authenticationService = <AuthenticationService><any>{
                acessoCidadaoLogin() { },
                facebookLogin() { },
                googleLogin() { },
                digitsLogin() { }
            };
            let transitionService = <TransitionService><any>{
                changeRootState: () => { },
                clearCache: () => { }
            };

            controller = new LoginController( authenticationService, dialogServiceMock, toastServiceMock, transitionService );

            // setup stubs
            toastInfo = sandbox.stub( toastServiceMock, 'info' );
            toastError = sandbox.stub( toastServiceMock, 'error' );
            transitionServiceChangeRootState = sandbox.stub( transitionService, 'changeRootState' );
            transitionServiceClearCache = sandbox.stub( transitionService, 'clearCache' );
            transitionServiceClearCache.returnsPromise().resolves();
        });

        describe( 'on instantiation', () => {
            it( 'should have a undefined username', () => {
                expect( controller.username ).to.be.undefined;
            });

            it( 'should have a undefined password', () => {
                expect( controller.password ).to.be.undefined;
            });

            it( 'should not be processing authentication', () => {
                expect( controller.processingLogin ).to.be.false;
            });

            it( 'should have pre-defined error messages', () => {
                expect( controller.errorMsgs ).to.be.deep.equal( {
                    accountNotLinked: 'User not found.'
                });
            });
        });


        describe( 'onEnterPressed()', () => {
            let acessoCidadaoLogin: Sinon.SinonStub;
            let acessoCidadaoLoginPromise: Sinon.SinonPromise;

            beforeEach(() => {
                acessoCidadaoLogin = sandbox.stub( authenticationService, 'acessoCidadaoLogin' );
                acessoCidadaoLoginPromise = acessoCidadaoLogin.returnsPromise();
                acessoCidadaoLoginPromise.resolves();
            });

            it( 'should login with provided credentials', () => {
                controller.username = 'hoisel';
                controller.password = '123456';

                controller.onEnterPressed();

                expect( acessoCidadaoLogin.calledWithExactly( controller.username, controller.password ) ).to.be.true;
            });

            it( 'should not login if no credentials provided', () => {
                controller.username = '';
                controller.password = '';

                controller.onEnterPressed();

                expect( acessoCidadaoLogin.notCalled ).to.be.true;
            });
        });


        describe( 'acessoCidadaoLogin(username, password)', () => {

            let username: string;
            let password: string;
            let acessoCidadaoLogin: Sinon.SinonStub;
            let acessoCidadaoLoginPromise: Sinon.SinonPromise;

            beforeEach(() => {
                username = 'joão';
                password = '123456';

                acessoCidadaoLogin = sandbox.stub( authenticationService, 'acessoCidadaoLogin' );
                acessoCidadaoLoginPromise = acessoCidadaoLogin.returnsPromise();
                acessoCidadaoLoginPromise.resolves();
            });

            it( 'should show default validation message if username or password is not provided', async () => {
                await controller.login( username, '' );
                await controller.login( '', password );

                expect( toastInfo.calledTwice ).to.be.true;
                expect( toastInfo.calledWithExactly( { title: 'Login e senha são obrigatórios' }) ).to.be.true;
                expect( acessoCidadaoLogin.notCalled ).to.be.true;
            });

            it( 'should authenticate with username and password on acesso cidadão', async () => {
                await controller.login( username, password );

                expect( acessoCidadaoLogin.calledWithExactly( username, password ) ).to.be.true;
            });

            describe( 'on login success', () => {
                beforeEach(() => acessoCidadaoLoginPromise.resolves() );

                it( 'should reset username and password', async () => {
                    await controller.login( username, password );

                    expect( controller.username ).to.be.undefined;
                    expect( controller.password ).to.be.undefined;
                });

                it( 'should exit authentication processing mode', async () => {
                    await controller.login( username, password );

                    expect( controller.processingLogin ).to.be.false;
                });

                it( 'should clear navigation history', async () => {
                    await controller.login( username, password );

                    expect( transitionServiceClearCache.calledOnce ).to.be.true;
                });

                it( 'should redirect to dashboard', async () => {
                    await controller.login( username, password );

                    expect( transitionServiceChangeRootState.calledWithExactly( 'app.dashboard.newsHighlights' ) ).to.be.true;
                });
            });


            describe( 'on login error', () => {
                beforeEach(() => acessoCidadaoLoginPromise.rejects( { data: 'Erro' }) );

                it( 'should show default login error message if user account is linked', async () => {
                    await controller.login( username, password );

                    expect( toastError.calledWithExactly( { title: 'Falha no Login' }) ).to.be.true;
                });

                it( 'should exit authentication processing mode if auth request failed', async () => {
                    await controller.login( username, password );

                    expect( controller.processingLogin ).to.be.false;
                });
            });
        });


        [ 'google', 'facebook', 'digits' ].forEach( providerName => {
            describe( `${providerName}Login()`, () => {

                let loginMethodName = `${providerName}Login`;
                let loginMethod: Sinon.SinonStub;
                let loginMethodPromise: Sinon.SinonPromise;

                beforeEach(() => {
                    loginMethod = sandbox.stub( authenticationService, loginMethodName );
                    loginMethodPromise = loginMethod.returnsPromise();
                    loginMethodPromise.resolves();
                });

                it( `should try authenticate on ${providerName}`, async () => {
                    await controller[ loginMethodName ]();

                    expect( loginMethod.calledWithExactly() ).to.be.true;
                });


                describe( 'on login success', () => {
                    beforeEach(() => loginMethodPromise.resolves() );

                    it( 'should reset username and password', async () => {
                        await controller[ loginMethodName ]();

                        expect( controller.username ).to.be.undefined;
                        expect( controller.password ).to.be.undefined;
                    });

                    it( 'should exit authentication processing mode', async () => {
                        await controller[ loginMethodName ]();

                        expect( controller.processingLogin ).to.be.false;
                    });

                    it( 'should clear navigation history', async () => {
                        await controller[ loginMethodName ]();

                        expect( transitionServiceClearCache.calledOnce ).to.be.true;
                    });

                    it( 'should redirect to dashboard', async () => {
                        await controller[ loginMethodName ]();

                        expect( transitionServiceChangeRootState.calledWithExactly( 'app.dashboard.newsHighlights' ) ).to.be.true;
                    });
                });


                describe( 'on login error', () => {
                    beforeEach(() => loginMethodPromise.rejects( { data: 'Erro' }) );

                    it( 'should show default login error message if user account is linked', async () => {
                        await controller[ loginMethodName ]();

                        expect( toastError.calledWithExactly( { title: 'Falha no Login' }) ).to.be.true;
                    });

                    it( 'should exit authentication processing mode if auth request failed', async () => {
                        await controller[ loginMethodName ]();

                        expect( controller.processingLogin ).to.be.false;
                    });
                });
            });
        });
    });


    describe( 'Component', () => {
        // test the component/directive itself
        let component = LoginComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( LoginController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( loginTemplate );
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