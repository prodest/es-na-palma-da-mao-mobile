import { IScope } from 'angular';
import { Summary, TransparencyApiService } from './index';
import { DateRangeFilter } from '../../../layout/index';


export abstract class MoneyFlowDetailController {

    public id: string;
    public title: string;
    public filter: DateRangeFilter;
    public summary: Summary | undefined;

    /**
     * Creates an instance of ExpenseDetailController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyService} transparencyApiService
     * @param {angular.ui.IStateParamsService} $stateParams
     * 
     * @memberOf ExpenseDetailController
     */
    constructor( protected $scope: IScope,
        protected $stateParams: angular.ui.IStateParamsService,
        protected transparencyApiService: TransparencyApiService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }


    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public async activate() {
        this.hydrateFromParams();
        await this.doFillSummary( this.id, this.filter );
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf ExpenseDetailController
     */
    protected hydrateFromParams() {
        this.id = this.$stateParams[ 'id' ];
        this.title = this.$stateParams[ 'label' ];
        this.filter = new DateRangeFilter( new Date( this.$stateParams[ 'from' ] ), new Date( this.$stateParams[ 'to' ] ) );
    }

    /**
     * 
     * 
     * @param {DateRangeFilter} filter
     * 
     * @memberOf MoneyFlowDetailController
     */
    public async doFillSummary( id: string, filter: DateRangeFilter ) {
        this.summary = await this.getSummary( id, filter );
    }

    /**
     * 
     * 
     * @returns {Promise<Summary>}
     * 
     * @memberOf ExpensesController
     */
    public abstract getSummary( id: string, filter: DateRangeFilter ): Promise<Summary>;
}
