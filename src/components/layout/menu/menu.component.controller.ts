import { IRootScopeService } from 'angular';

import { AuthenticationStorageService, AcessoCidadaoClaims, AuthenticationService } from '../../shared/authentication/index';
import defaultAvatarSrc = require( './img/user.png' );
import { ToastService, TransitionService } from '../../shared/index';
import { Route } from '../../shared/routes/index';
import { DriverLicenseStorage } from '../../detran/shared/index';

/**
 * Controller raiz da aplicação
 */
export default class MenuController {

    public static $inject: string[] = [
        '$rootScope',
        '$mdSidenav',
        '$ionicHistory',
        '$ionicPlatform',
        '$mdDialog',
        '$mdBottomSheet',
        '$mdMenu',
        '$mdSelect',
        'authenticationService',
        'authenticationStorageService',
        'toast',
        'detranStorage',
        'transitionService'
    ];

    /**
     * Creates an instance of MenuController.
     * 
     * @param {IRootScopeService} $rootScope
     * @param {angular.material.ISidenavService} $mdSidenav
     * @param {ionic.navigation.IonicHistoryService} $ionicHistory
     * @param {ionic.platform.IonicPlatformService} $ionicPlatform
     * @param {angular.material.IDialogService} $mdDialog
     * @param {angular.material.IBottomSheetService} $mdBottomSheet
     * @param {angular.material.IMenuService} $mdMenu
     * @param {*} $mdSelect
     * @param {AuthenticationService} authenticationService
     * @param {AuthenticationStorageService} authenticationStorageService
     * @param {ToastService} toast
     * @param {DriverLicenseStorage} driverLicenseStorage
     * @param {TransitionService} transitionService
     * 
     * @memberOf MenuController
     */
    constructor( private $rootScope: IRootScopeService,
        private $mdSidenav: angular.material.ISidenavService,
        private $ionicHistory: ionic.navigation.IonicHistoryService,
        private $ionicPlatform: ionic.platform.IonicPlatformService,
        private $mdDialog: angular.material.IDialogService,
        private $mdBottomSheet: angular.material.IBottomSheetService,
        private $mdMenu: angular.material.IMenuService,
        private $mdSelect: any,
        private authenticationService: AuthenticationService,
        private authenticationStorageService: AuthenticationStorageService,
        private toast: ToastService,
        private driverLicenseStorage: DriverLicenseStorage,
        private transitionService: TransitionService ) {
        this.activate();
    }

    private mdSideNaveId = 'left';

    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public activate(): void {
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
     * @type {boolean}
     * @memberOf MenuController
     */
    public get hasDriverLicense(): boolean {
        return this.driverLicenseStorage.hasDriverLicense;
    }

    /**
     * 
     * 
     * @readonly
     * @type {string}
     */
    public get avatarUrl(): string {
        if ( this.authenticationService.isAuthenticated ) {
            return this.authenticationStorageService.googleAvatarUrl || this.authenticationStorageService.facebookAvatarUrl || defaultAvatarSrc;
        }
        return defaultAvatarSrc;
    }

    /**
     * 
     * 
     * @readonly
     * @type {AcessoCidadaoClaims}
     */
    public get user(): AcessoCidadaoClaims {
        return this.authenticationService.user;
    }

    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     */
    public get authenticated(): boolean {
        return this.authenticationService.isAuthenticated;
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

        let stateName = route.name;
        if ( route.menuName === 'Situação CNH' ) {
            stateName = this.authenticationService.isAuthenticated && this.hasDriverLicense ? 'app.driverLicenseStatus' : 'app.driverLicense';
        }

        if ( !this.authenticationService.isAuthenticated && route.secure ) {
            stateName = 'app.secureWarning';
        }

        this.transitionService.changeMenuState( stateName );
    }

    /**
     * Desloga usuário do sistema
     */
    public signOut(): void {
        this.closeSideNav();
        this.authenticationService.signOut(() => this.navigateToHome() );
    }

    /**
     * 
     * @memberOf MenuController
     */
    public navigateToHome() {
        this.closeSideNav();
        this.transitionService.changeRootState( 'home' );
    }
}
