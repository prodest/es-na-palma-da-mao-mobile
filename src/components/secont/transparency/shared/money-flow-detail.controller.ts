import { IPromise, IScope } from 'angular';
import { Summary, TransparencyService } from './index';
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
     * @param {TransparencyService} transparencyService
     * @param {angular.ui.IStateParamsService} $stateParams
     * 
     * @memberOf ExpenseDetailController
     */
    constructor( protected $scope: IScope,
        protected $stateParams: angular.ui.IStateParamsService,
        protected transparencyService: TransparencyService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
        this.$scope.$on( '$ionicView.beforeEnter', () => angular.element( document.querySelectorAll( 'ion-header-bar' ) ).removeClass( 'espm-header-tabs' ) );
    }


    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public activate(): void {
        this.hydrateFromParams();
        this.getSummary( this.id, this.filter );
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
     * @returns {Promise<Summary>}
     * 
     * @memberOf ExpensesController
     */
    public abstract getSummary( id: string, filter: DateRangeFilter ): IPromise<Summary>;
}
