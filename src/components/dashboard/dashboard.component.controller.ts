import { IScope } from 'angular';
import { TransitionService } from '../shared/index';

export class DashBoardController {

    public static $inject: string[] = [ '$scope', '$ionicTabsDelegate', 'transitionService' ];

    /**
     * Creates an instance of DashBoardController.
     * 
     * @param {IScope} $scope
     * @param {ionic.tabs.IonicTabsDelegate} $ionicTabsDelegate
     * @param {TransitionService} transitionService
     * 
     * @memberOf DashBoardController
     */
    constructor( private $scope: IScope,
                 private $ionicTabsDelegate: ionic.tabs.IonicTabsDelegate,
                 private transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     * Ativa o component
     *
     * @returns {void}
     */
    public activate(): void {
        angular.element( document.querySelectorAll( 'ion-header-bar' ) ).addClass( 'espm-header-tabs' );
    }

    /**
     * 
     * 
     * @param {string} stateName
     * @param {string} direction
     * @param {number} tabIndex
     * 
     * @memberOf DashBoardController
     */
    public navigateToTab( stateName: string, direction: string, tabIndex: number ) {
        if ( tabIndex !== this.$ionicTabsDelegate.selectedIndex() ) {
            this.transitionService.changeTab( stateName, direction );
            this.$ionicTabsDelegate.select( tabIndex );
        }
    }
}




