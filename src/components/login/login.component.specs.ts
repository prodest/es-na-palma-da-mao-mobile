import { LoginController } from './login.component.controller';
import { AuthenticationService, Identity } from '../shared/authentication/index';
import { PushService } from '../shared/push/index';
import { TransitionService } from '../shared/index';
import { environment, dialogServiceMock, toastServiceMock, $windowMock } from '../shared/tests/index';

let expect = chai.expect;

describe( 'Login', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: LoginController;
        let pushService: PushService;
        let transitionService: TransitionService;

        // dialogs
        let dialogConfirm: Sinon.SinonStub;
        let dialogConfirmPromise: Sinon.SinonPromise;
        let toastInfo: Sinon.SinonStub;
        let toastError: Sinon.SinonStub;

        // api
        let authenticationService: AuthenticationService;
        let signInWithCredentialsPromise: Sinon.SinonPromise;
        let signInWithCredentials: Sinon.SinonStub;
        let pushConfigInit: Sinon.SinonStub;
        let digitsLoginPromise: Sinon.SinonPromise;
        let googleLoginPromise: Sinon.SinonPromise;
        let facebookLoginPromise: Sinon.SinonPromise;
        let signInWithIdentity: Sinon.SinonStub;
        let signInWithIdentityPromise: Sinon.SinonPromise;
        let transitionServiceClearCachePromise: Sinon.SinonPromise;
        // models
        let identity: Identity;

        beforeEach(() => {
            environment.refresh();
            authenticationService = <AuthenticationService><any>{
                signInWithIdentity() { },
                signInWithCredentials() { },
                facebookLogin() { },
                googleLogin() { },
                digitsLogin() { }
            };
            pushService = <PushService>{ init() { } };
            transitionService = <TransitionService><any>{
                changeRootState: () => { },
                clearCache: () => {}
            };

            controller = new LoginController(
                authenticationService,
                dialogServiceMock,
                toastServiceMock,
                pushService,
                transitionService );

            // setup stubs
            dialogConfirm = sandbox.stub( dialogServiceMock, 'confirm' );
            dialogConfirmPromise = dialogConfirm.returnsPromise();
            toastInfo = sandbox.stub( toastServiceMock, 'info' );
            toastError = sandbox.stub( toastServiceMock, 'error' );

            identity = <Identity>{
                client_id: '21312341324',
                client_secret: '132132323',
                grant_type: 'type',
                scope: 'scope',
                refresh_token: '234jhj546hjhdjfgh'
            };

            pushConfigInit = sandbox.stub( pushService, 'init' );
            signInWithIdentity = sandbox.stub( authenticationService, 'signInWithIdentity' );
            signInWithIdentityPromise = signInWithIdentity.returnsPromise();
            signInWithCredentials = sandbox.stub( authenticationService, 'signInWithCredentials' );
            signInWithCredentialsPromise = signInWithCredentials.returnsPromise();
            digitsLoginPromise = sandbox.stub( authenticationService, 'digitsLogin' ).returnsPromise();
            googleLoginPromise = sandbox.stub( authenticationService, 'googleLogin' ).returnsPromise();
            facebookLoginPromise = sandbox.stub( authenticationService, 'facebookLogin' ).returnsPromise();
            transitionServiceClearCachePromise = sandbox.stub( transitionService, 'clearCache' ).returnsPromise();
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

        describe( 'isAccountNotLinked(data)', () => {
            it( 'should return true if authentication error is "User not found."', () => {
                expect( controller.isAccountNotLinked( { error: 'User not found.' }) ).to.be.true;
            });
        });

        describe( 'showDialogAccountNotLinked()', () => {
            it( 'should show confirm dialog', () => {
                controller.showDialogAccountNotLinked();

                expect( dialogConfirm.calledWithExactly( {
                    title: 'Conta não vinculada',
                    content: 'Acesse utilizando o usuário e senha ou clique para criar uma nova conta',
                    ok: 'Criar conta'
                }) ).to.be.true;
            });

           /* TODO 
           
           it( 'should open acesso cidadão web site on dialog confirm', () => {
                dialogConfirmPromise.resolves();

                controller.showDialogAccountNotLinked();

                expect( $windowOpen.calledWithExactly( 'https://acessocidadao.es.gov.br/Conta/VerificarCPF', '_system' ) ).to.be.true;
            });*/

            // TODO: não usa mais windows open, usa inAppBrowser 
            it( 'should not open acesso cidadão web site on dialog cancel', () => {
                let $windowOpen = sandbox.stub( $windowMock, 'open' ); // replace original activate
                dialogConfirmPromise.rejects();

                controller.showDialogAccountNotLinked();

                expect( $windowOpen.notCalled ).to.be.true;
            });
        });

        describe( 'loginWithCredentials(username, password)', () => {

            let username: string;
            let password: string;

            beforeEach(() => {
                controller.processingLogin = false;
                username = 'joão';
                password = '123456';
            });

            it( 'should put controller on processing authentication mode', () => {
                controller.processingLogin = false;

                controller.loginWithCredentials( username, password );

                expect( controller.processingLogin ).to.be.true;
            });

            it( 'should show validation message if username or password is not provided', () => {
                controller.loginWithCredentials( username, '' );
                controller.loginWithCredentials( '', password );

                expect( toastInfo.calledTwice ).to.be.true;
                expect( toastInfo.calledWithExactly( { title: 'Login e senha são obrigatórios' }) ).to.be.true;
                expect( signInWithCredentials.notCalled ).to.be.true;
            });

            it( 'should authenticate with username and password on acesso cidadão', () => {
                controller.loginWithCredentials( username, password );

                expect( signInWithCredentials.calledWithExactly( username, password ) ).to.be.true;
            });


            it( 'should call success callback on acesso cidadão authentication success', () => {
                let onAcessoCidadaoLoginSuccess = sandbox.stub( controller, 'onAcessoCidadaoLoginSuccess' );
                signInWithCredentialsPromise.resolves();

                controller.loginWithCredentials( username, password );

                expect( onAcessoCidadaoLoginSuccess.calledOnce ).to.be.true;
            });

            it( 'should call error callback on acesso cidadão authentication error', () => {
                let onAcessoCidadaoLoginError = sandbox.stub( controller, 'onAcessoCidadaoLoginError' );
                signInWithCredentialsPromise.rejects();

                controller.loginWithCredentials( username, password );

                expect( onAcessoCidadaoLoginError.calledOnce ).to.be.true;
            });


            it( 'should exit authentication processing mode if auth request successfull', () => {
                signInWithCredentialsPromise.resolves();

                controller.loginWithCredentials( username, password );

                expect( controller.processingLogin ).to.be.false;
            });

            it( 'should exit authentication processing mode if auth request failed', () => {
                signInWithCredentialsPromise.rejects();

                controller.loginWithCredentials( username, password );

                expect( controller.processingLogin ).to.be.false;
            });
        });

        describe( 'loginWithIdentity(identity)', () => {
            it( 'authenticate user on acesso cidadão with provided identity', () => {
                controller.loginWithIdentity( identity );

                expect( signInWithIdentity.calledWithExactly( identity ) ).to.be.true;
            });

            it( 'should call success callback on acesso cidadão authentication success', () => {
                let onAcessoCidadaoLoginSuccess = sandbox.stub( controller, 'onAcessoCidadaoLoginSuccess' );
                signInWithIdentityPromise.resolves();

                controller.loginWithIdentity( identity );

                expect( onAcessoCidadaoLoginSuccess.calledOnce ).to.be.true;
            });

            it( 'should call error callback on acesso cidadão authentication error', () => {
                let onAcessoCidadaoLoginError = sandbox.stub( controller, 'onAcessoCidadaoLoginError' );
                signInWithIdentityPromise.rejects();

                controller.loginWithIdentity( identity );

                expect( onAcessoCidadaoLoginError.calledOnce ).to.be.true;
            });
        });

        describe( 'onAcessoCidadaoLoginSuccess()', () => {

            it( 'should init push config', () => {
                controller.onAcessoCidadaoLoginSuccess();

                expect( pushConfigInit.called ).to.be.true;
            });

            it( 'should clear username', () => {
                controller.username = 'vizeke';

                controller.onAcessoCidadaoLoginSuccess();

                expect( controller.username ).to.be.undefined;
            });

            it( 'should clear password', () => {
                controller.password = 'vizeke';

                controller.onAcessoCidadaoLoginSuccess();

                expect( controller.password ).to.be.undefined;
            });

            it( 'should redirect user to dashboard', () => {
                transitionServiceClearCachePromise.resolves();
                let goToDashboard = sandbox.stub( controller, 'goToDashboard' );

                controller.onAcessoCidadaoLoginSuccess();

                expect( goToDashboard.calledOnce ).to.be.true;
            });
        });


        describe( 'onAcessoCidadaoLoginError()', () => {

            it( 'should open modal to link account if account is not already linked', () => {
                sandbox.stub( controller, 'isAccountNotLinked' ).returns( true );
                let showDialogAccountNotLinked = sandbox.stub( controller, 'showDialogAccountNotLinked' );

                controller.onAcessoCidadaoLoginError( { data: { error: 'Erro' } });

                expect( showDialogAccountNotLinked.calledOnce ).to.be.true;
            });

            it( 'should show login error message is user account is linked', () => {
                sandbox.stub( controller, 'isAccountNotLinked' ).returns( false );

                controller.onAcessoCidadaoLoginError( { data: { error: 'Erro' } });

                expect( toastError.calledWithExactly( { title: 'Falha no Login' }) ).to.be.true;
            });
        });

        /* TODO
        describe( 'openUrlForgotPassword()', () => {
            it( 'should open acesso cidadão forgot password page', () => {
                controller.openUrlForgotPassword();

                expect( $windowOpen.calledWithExactly( 'https://acessocidadao.es.gov.br/Conta/SolicitarReinicioSenha', '_system' ) ).to.be.true;
            });
        });*/


        describe( 'onEnterPressed()', () => {
            it( 'should signin with provided credentials', () => {
                let loginWithCredentials = sandbox.stub( controller, 'loginWithCredentials' );
                controller.username = 'hoisel';
                controller.password = '123456';

                controller.onEnterPressed();

                expect( loginWithCredentials.calledWithExactly( controller.username, controller.password ) ).to.be.true;
            });

            it( 'should not signin if no credentials provided', () => {
                let loginWithCredentials = sandbox.stub( controller, 'loginWithCredentials' );
                controller.username = '';
                controller.password = '';

                controller.onEnterPressed();

                expect( loginWithCredentials.notCalled ).to.be.true;
            });
        });


        describe( 'goToDashboard()', () => {
            let nextViewOptions: Sinon.SinonStub;

            beforeEach(() => {
                nextViewOptions = sandbox.stub( environment.$ionicHistory, 'nextViewOptions' );
            });

            it( 'should redirect to dashboard', () => {
                let changeRootState = sandbox.stub( transitionService, 'changeRootState' );

                controller.goToDashboard();

                expect( changeRootState.calledWithExactly( 'app.dashboard.newsHighlights' ) ).to.be.true;
            });
        });

        describe( 'facebookLogin()', () => {
            it( 'should authenticate on acesso cidadão with the provided facebook identity', () => {
                facebookLoginPromise.resolves( identity );

                controller.facebookLogin();

                expect( signInWithIdentity.calledWith( identity ) ).to.be.true;
            });

            it( 'should show login error message for facebook on error', () => {
                facebookLoginPromise.rejects();

                controller.facebookLogin();

                expect( toastError.calledWithExactly( { title: '[Facebook] Falha no login' }) ).to.be.true;
            });
        });

        describe( 'googleLogin()', () => {
            it( 'should acesso cidadão with the provided google identity', () => {
                googleLoginPromise.resolves( identity );

                controller.googleLogin();

                expect( signInWithIdentity.calledWithExactly( identity ) ).to.be.true;
            });

            it( 'should show login error message for google on error', () => {
                googleLoginPromise.rejects();

                controller.googleLogin();

                expect( toastError.calledWithExactly( { title: '[Google] Falha no login' }) ).to.be.true;
            });
        });


        describe( 'digitsLogin()', () => {
            it( 'should authenticate on acesso cidadão with the provided digits identity', () => {
                digitsLoginPromise.resolves( identity );

                controller.digitsLogin();

                expect( signInWithIdentity.calledWithExactly( identity ) ).to.be.true;
            });

            it( 'should show login error message for digits on error', () => {
                digitsLoginPromise.rejects();

                controller.digitsLogin();

                expect( toastError.calledWithExactly( { title: '[SMS] Falha no login' }) ).to.be.true;
            });
        });
    });
});