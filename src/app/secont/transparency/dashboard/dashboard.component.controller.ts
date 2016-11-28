import { IScope } from 'angular';
import { TransitionService } from '../../../shared/shared.module';
import { Route, statesJson } from '../../../shared/routes/index';

export class DashboardController {

    public static $inject: string[] = [ '$scope', 'transitionService' ];

    public menuItems: Route[];

    /**
     * Creates an instance of DashboardController.
     * 
     * @param {IScope} $scope
     * @param {TransitionService} transitionService
     * 
     * @memberOf DashboardController
     */
    constructor( private $scope: IScope, private transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public activate(): void {
        this.buildMenuFromRoutes();
    }

    /**
     * 
     * 
     * 
     * @memberOf DashboardController
     */
    public buildMenuFromRoutes() {
        this.menuItems = statesJson.filter(( s: Route ) => s.group === 'Transparência' && s.groupMenu );
    }

    /**
     * 
     * 
     * @param {number} state
     * 
     * @memberOf ExpensesController
     */
    public goTo( state: string ) {
        this.transitionService.changeState( state );
    }


    /**
     * 
     * 
     * @param {Route} item
     * @returns {boolean}
     * 
     * @memberOf DashboardController
     */
    public isExpense( item: Route ): boolean {
        return item.name.indexOf( 'Expense' ) !== -1;
    }


    /**
     * 
     * 
     * @param {Route} item
     * @returns {boolean}
     *
     * @memberOf DashboardController
     */
    public isRevenue( item: Route ): boolean {
        return item.name.indexOf( 'Revenue' ) !== -1;
    }
}
