import { IScope, IPromise } from 'angular';
import { Summary, SummaryItem, TransparencyService } from './index';
import { TransitionService } from '../../../shared/index';
import { DateRangeFilter } from '../../../layout/index';

export abstract class MoneyFlowController {

    public summary: Summary | undefined;
    public filter: DateRangeFilter;
    public showFilter: boolean = false;
    public showChart: boolean = true;

    /**
     * Creates an instance of MoneyFlowController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyService} transparencyService
     * @param {TransitionService} transitionService
     * 
     * @memberOf MoneyFlowController
     */
    constructor( protected $scope: IScope,
        protected transparencyService: TransparencyService,
        protected transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
        this.$scope.$on( '$ionicView.beforeEnter', () => angular.element( document.querySelectorAll( 'ion-header-bar' ) ).removeClass( 'espm-header-tabs' ) );
    }


    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public activate(): void {
        this.doFilter( DateRangeFilter.currentYear() );
    }

    /**
     * 
     * 
     * @param {Date} date
     * 
     * @memberOf ExpensesByAreaController
     */
    public doFilter( filter: DateRangeFilter ): void {
        this.showFilter = false;
        this.getSummary( filter ).then(() => this.filter = filter );
    }

    /**
     * 
     * 
     * @returns {Promise<Summary>}
     * 
     * @memberOf ExpensesController
     */
    public abstract getSummary( filter: DateRangeFilter ): IPromise<Summary>;

    /**
     * 
     * 
     * @param {SummaryItem} item
     * 
     * @memberOf ExpensesByAreaController
     */
    public openDetails( state: string, item: SummaryItem ): void {
        this.transitionService.changeState( state,
            {
                id: item.originId,
                label: item.label,
                from: this.filter.from,
                to: this.filter.to
            });
    }
}
