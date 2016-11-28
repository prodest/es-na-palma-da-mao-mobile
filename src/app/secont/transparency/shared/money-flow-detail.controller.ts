import { IScope } from 'angular';
import { DateRangeFilter, YearFilter } from '../../../layout/layout.module';
import { TransparencyApiService } from './transparency-api.service';
import { MoneyFlow } from './models/index';

export abstract class MoneyFlowDetailController<TFilter extends DateRangeFilter | YearFilter> {

    public id: string;
    public title: string;
    public filter: TFilter;
    public moneyFlow: MoneyFlow;
    public showChart: boolean = true;

    /**
     * Creates an instance of MoneyFlowDetailController.
     * 
     * @param {IScope} $scope
     * @param {angular.ui.IStateParamsService} $stateParams
     * @param {TransparencyApiService} transparencyApiService
     * 
     * @memberOf MoneyFlowDetailController
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
        this.hydrateFromParams( this.$stateParams );
        this.moneyFlow = await this.getMoneyFlow( this.id, this.filter );
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf MoneyFlowDetailController
     */
    protected hydrateFromParams( { id, label, from, to, year }: any ) {
        this.id = id;
        this.title = label;

        if ( from && to ) {
            this.filter = new DateRangeFilter( new Date( from ), new Date( to ) ) as TFilter;
        }

        if ( year ) {
            this.filter = <TFilter>new YearFilter( +year ) as TFilter;
        }
    }


    /**
     * 
     * 
     * @abstract
     * @param {string} id
     * @param {TFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf MoneyFlowDetailController
     */
    public abstract getMoneyFlow( id: string, filter: TFilter ): Promise<MoneyFlow>;
}


