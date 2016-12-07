import { IScope } from 'angular';
import { TransitionService } from '../../../shared/shared.module';
import { DateRangeFilter, YearFilter } from '../../../layout/layout.module';
import { TransparencyApiService } from './transparency-api.service';
import { MoneyFlow, MoneyFlowItem } from './models/index';

export abstract class MoneyFlowController<TFilter extends DateRangeFilter | YearFilter> {

    public reportTitle: string | undefined;
    public moneyFlow: MoneyFlow | undefined;
    public filter: TFilter;
    public showFilter: boolean = false;
    public showChart: boolean = true;

    /**
     * Creates an instance of MoneyFlowController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyApiService} transparencyApiService
     * @param {TransitionService} transitionService
     * 
     * @memberOf MoneyFlowController
     */
    constructor( protected $scope: IScope,
        protected transparencyApiService: TransparencyApiService,
        protected transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }

    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public abstract activate();


    /**
     * 
     * 
     * @param {TFilter} filter
     * 
     * @memberOf MoneyFlowController
     */
    public doFilter( filter: TFilter ) {

        // inicia a animação que fecha o filtro 
        this.showFilter = false;

        // trick: espera 300ms que é o tempo da animação do filtro resolver a promise e renderizar
        // o moneyFlow. Impede que a tela congele, pois o processamento da animação do filtro 
        // conflita com a renderização do moneyFlow(javascript single thread)
        window.setTimeout( async () => {
            try {
                this.moneyFlow = await this.getMoneyFlow( filter );
            } catch ( error ) {
                this.moneyFlow = undefined;
                this.$scope.$apply();
            } finally {
                this.reportTitle = filter.description(); // default value
                this.filter = filter;
                this.onFiltered();
            }
        }, 300 );
    }


    /**
     * 
     * 
     * 
     * @memberOf MoneyFlowController
     */
    public onFiltered(): void {}

    /**
     * 
     * 
     * @abstract
     * @param {TFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf MoneyFlowController
     */
    public abstract getMoneyFlow( filter: TFilter ): Promise<MoneyFlow>;


    /**
     * 
     * 
     * @param {string} state
     * @param {SummaryItem} item
     * 
     * @memberOf MoneyFlowController
     */
    public openDetails( state: string, item: MoneyFlowItem ): void {
        this.transitionService.changeState( state, Object.assign( { id: item.originId, label: item.label }, this.filter ) );
    }
}
