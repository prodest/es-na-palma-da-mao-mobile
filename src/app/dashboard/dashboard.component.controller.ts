import { TransitionService } from '../shared/shared.module';

export class DashBoardController {

    public static $inject: string[] = [ '$ionicTabsDelegate', 'transitionService' ];

    /**
     * Creates an instance of DashBoardController.
     * 
     * @param {ionic.tabs.IonicTabsDelegate} $ionicTabsDelegate
     * @param {TransitionService} transitionService
     * 
     * @memberOf DashBoardController
     */
    constructor( private $ionicTabsDelegate: ionic.tabs.IonicTabsDelegate,
                 private transitionService: TransitionService ) {
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




