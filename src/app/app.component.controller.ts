import { IRootScopeService, IScope, IWindowService } from 'angular';
import { ToastService, TransitionService } from './shared/shared.module';
import { User, AuthenticationService } from './security/security.module';
import { Route, statesJson } from './shared/routes/index';

/**
 * Controller raiz da aplicação
 */
export class AppController {

    public static $inject: string[] = [
        '$rootScope',
        '$mdSidenav',
        '$ionicHistory',
        '$ionicPlatform',
        '$mdDialog',
        '$mdBottomSheet',
        '$mdMenu',
        '$mdSelect',
        '$state',
        'authenticationService',
        'toast',
        'transitionService',
        '$window',
        '$scope'
    ];

    public menu: { items: Route[], groups: any };

    /**
     * Creates an instance of AppController.
     * 
     * @param {IRootScopeService} $rootScope
     * @param {angular.material.ISidenavService} $mdSidenav
     * @param {ionic.navigation.IonicHistoryService} $ionicHistory
     * @param {ionic.platform.IonicPlatformService} $ionicPlatform
     * @param {angular.material.IDialogService} $mdDialog
     * @param {angular.material.IBottomSheetService} $mdBottomSheet
     * @param {angular.material.IMenuService} $mdMenu
     * @param {*} $mdSelect
     * @param {angular.ui.IStateService} $state
     * @param {AuthenticationService} authService
     * @param {ToastService} toast
     * @param {TransitionService} transitionService
     * @param {IWindowService} $window
     * @param {IScope} $scope
     * 
     * @memberOf AppController
     */
    constructor( private $rootScope: IRootScopeService,
        private $mdSidenav: angular.material.ISidenavService,
        private $ionicHistory: ionic.navigation.IonicHistoryService,
        private $ionicPlatform: ionic.platform.IonicPlatformService,
        private $mdDialog: angular.material.IDialogService,
        private $mdBottomSheet: angular.material.IBottomSheetService,
        private $mdMenu: angular.material.IMenuService,
        private $mdSelect: any,
        private $state: angular.ui.IStateService,
        private authService: AuthenticationService,
        private toast: ToastService,
        private transitionService: TransitionService,
        private $window: IWindowService,
        private $scope: IScope ) {
        this.activate();
    }

    private mdSideNaveId = 'left';

    /**
     * 
     * 
     * @readonly
     * @private
     * 
     * @memberOf MenuController
     */
    public noHeaderShadow = true;

    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public activate(): void {

        this.menu = this.buildMenuFromRoutes();

        this.$rootScope.$on( '$ionicView.beforeEnter', () => {

            this.noHeaderShadow = [ 'app.dashboard', 'app.busInfo', 'app.noAccess' ].some( state => this.$state.current.name!.startsWith( state ) );

            /**
            * Para android: esconde controles Action e Dialog se o usuário clica no botão voltar do
            * dispositivo.
            */
            this.$mdBottomSheet.cancel();
            this.$mdDialog.cancel();
        });


        //  $ionicPlatform.registerBackButtonAction(callback, priority, [actionId])
        //
        //  Register a hardware back button action. Only one action will execute
        //  when the back button is clicked, so this method decides which of
        //  the registered back button actions has the highest priority.
        //
        //  For example, if an actionsheet is showing, the back button should
        //  close the actionsheet, but it should not also go back a page view
        //  or close a modal which may be open.
        //
        //  The priorities for the existing back button hooks are as follows:
        //  Return to previous view = 100
        //  Close side template         = 150
        //  Dismiss modal           = 200
        //  Close action sheet      = 300
        //  Dismiss popup           = 400
        //  Dismiss loading overlay = 500
        //
        //  Your back button action will override each of the above actions
        //  whose priority is less than the priority you provide. For example,
        //  an action assigned a priority of 101 will override the ‘return to
        //  previous view’ action, but not any of the other actions.
        //
        //  Learn more at : http://ionicframework.com/docs/api/service/$ionicPlatform/#registerBackButtonAction

        this.$ionicPlatform.registerBackButtonAction(() => {

            if ( this.$rootScope.backButtonPressedOnceToExit ) {
                this.$rootScope.backButtonPressedOnceToExit = false;
                ionic.Platform.exitApp();
            }

            const sidenavIsOpen = this.$mdSidenav( this.mdSideNaveId ).isOpen();
            const bottomSheetIsOpen = angular.element( document.querySelectorAll( 'md-bottom-sheet' ) ).length > 0;
            const dialogIsOpen = angular.element( document.querySelectorAll( '[id^=dialog]' ) ).length > 0;
            const menuContentIsOpen = angular.element( document.querySelectorAll( 'md-template-content' ) ).length > 0;
            const selectMenuIsOpen = angular.element( document.querySelectorAll( 'div._md-select-menu-container._md-active' ) ).length > 0;
            const footerPanelOpen = this.$rootScope.footerPanel && angular.element( document.querySelectorAll( 'div.espm-footer-panel.active' ) ).length > 0;
            const previousStateIsEmpty = !this.$ionicHistory.backView();

            if ( sidenavIsOpen ) {
                this.$mdSidenav( this.mdSideNaveId ).close();
            } else if ( bottomSheetIsOpen ) {
                this.$mdBottomSheet.cancel();
            } else if ( dialogIsOpen ) {
                this.$mdDialog.cancel();
            } else if ( menuContentIsOpen ) {
                this.$mdMenu.hide();
            } else if ( selectMenuIsOpen ) {
                this.$mdSelect.hide();
            } else if ( footerPanelOpen ) {
                this.$rootScope.footerPanel.backButtonAction();
            } else if ( previousStateIsEmpty ) {

                this.$rootScope.backButtonPressedOnceToExit = true;
                this.toast.info( { title: 'Aperte voltar novamente para sair' });

                setTimeout(() => {
                    this.$rootScope.backButtonPressedOnceToExit = false;
                }, 2000 );

            } else {
                // se existe uma view anterior, volta para ela
                this.transitionService.goBack();
            }

        }, 100 );
    }


    /**
     * 
     * 
     * @readonly
     * @type {User}
     */
    public get user(): User {
        return this.authService.user;
    }



    /**
     *  Fecha a barra de navegação lateral
     *  It will use with event on-swipe-left="closeSideNav()" on-drag-left="closeSideNav()"
     *  When user swipe or drag md-sidenav to left side
     *
     *  @returns {void}
     */
    public closeSideNav(): void {
        if ( this.$mdSidenav( this.mdSideNaveId ).isOpen() ) {
            this.$mdSidenav( this.mdSideNaveId ).close();
        }
    }

    /**
     * Alterna exibição do sidebar
     *
     * @returns {void}
     */
    public toggleLeft(): void {
        this.$mdSidenav( this.mdSideNaveId ).toggle();
    }

    /**
     * Navega para o state especificado
     *
     * @param {string} stateName - o nome do state destino
     *
     * @returns {void}
     */
    public navigateTo( route: Route ): void {
        this.closeSideNav();

        if ( route.deepLink ) {
            this.$window.open( route.url, '_system' );
            if ( this.$scope.isAndroid ) {
                setTimeout( this.$window.open( route.fallbackUrl, '_system' ), 500 );
            }
            console.log( route.url );
        } else {
            let toRoute = !this.authService.user.isAuthenticated && route.secure
                ? 'app.noAccess'
                : route.name;
            this.transitionService.changeMenuState( toRoute );
        }
    }

    /**
     * Desloga usuário do sistema
     */
    public logout(): void {
        this.closeSideNav();
        this.authService.logout(() => this.navigateToHome() );
    }

    /**
     * 
     * @memberOf MenuController
     */
    public navigateToHome() {
        this.closeSideNav();
        this.transitionService.changeRootState( 'home' );
    }

    /********************************************** Private API  **********************************************/

    /**
     * 
     * 
     * @private
     * 
     * @memberOf AppController
     */
    private buildMenuFromRoutes(): { items: Route[], groups: any } {
        const menu = {
            items: statesJson.filter(( s: Route ) => s.menu ),
            groups: {}
        };
        menu.items.forEach( item => {
            let groupName = item.group || 'Principal';
            menu.groups[ groupName ] = menu.groups[ groupName ] || [];
            menu.groups[ groupName ].push( item );
        });

        return menu;
    }
}
