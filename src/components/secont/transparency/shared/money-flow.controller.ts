import { IScope } from 'angular';
import { Summary, SummaryItem, TransparencyApiService } from './index';
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
     * @param {TransparencyService} transparencyApiService
     * @param {TransitionService} transitionService
     * 
     * @memberOf MoneyFlowController
     */
    constructor( protected $scope: IScope,
        protected transparencyApiService: TransparencyApiService,
        protected transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
        this.$scope.$on( '$ionicView.beforeEnter', () => angular.element( document.querySelectorAll( 'ion-header-bar' ) ).removeClass( 'espm-header-tabs' ) );
    }


    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public async activate() {
        await this.doFilter( DateRangeFilter.currentYear() );
    }

    /**
     * 
     * 
     * @param {Date} date
     * 
     * @memberOf ExpensesByAreaController
     */
    public async doFilter( filter: DateRangeFilter ) {
        this.showFilter = false;
        await this.doFillSummary( filter );
        this.filter = filter;
    }

    /**
     * 
     * 
     * @param {DateRangeFilter} filter
     * 
     * @memberOf MoneyFlowController
     */
    public async doFillSummary( filter: DateRangeFilter ) {
        this.summary = await this.getSummary( filter );
    }

    /**
     * 
     * 
     * @returns {Promise<Summary>}
     * 
     * @memberOf ExpensesController
     */
    public abstract getSummary( filter: DateRangeFilter ): Promise<Summary>;

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
