import { IScope } from 'angular';
import { TransitionService } from '../../../shared/shared.module';
import { YearFilter } from '../../../layout/layout.module';
import { ChartModel } from '../transparency.module';
import { PublicWorksItem, TransparencyApiService } from '../shared/index';

export class PublicWorksController {

    public static $inject: string[] = [ '$scope', 'transparencyApiService', 'transitionService' ];

    public reportTitle: string | undefined;
    public showChart = true;
    public total: number;
    public quantity: number;
    public lastUpdate: string;
    public info: string;
    public items: PublicWorksItem[] | undefined;
    public filter: YearFilter;
    public showFilter: boolean = false;
    public chart: ChartModel | undefined;

    /**
     * Creates an instance of PublicWorksController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyApiService} transparencyApiService
     * @param {TransitionService} transitionService
     * 
     * @memberOf PublicWorksController
     */
    constructor( private $scope: IScope,
        private transparencyApiService: TransparencyApiService,
        private transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }


    /**
     * Ativa o component
     *
     * @returns {void}
     */
    public activate() {
        this.doFilter( YearFilter.currentYear() );
    }


    /**
     * 
     * 
     * @param {YearFilter} filter
     * 
     * @memberOf PublicWorksController
     */
    public doFilter( filter: YearFilter ) {

        // inicia animação que fecha o filtro
        this.showFilter = false;

        // trick: espera 300ms que é o tempo da animação do filtro buscar os dados.
        // Impede que a tela congele, pois o processamento da animação do filtro 
        // conflita com a renderização dos items retornados(javascript single thread)
        window.setTimeout( async () => {
            try {
                const { total, quantity, info, items, lastUpdate  } = await this.transparencyApiService.getPublicWorksByCities( filter );

                const plottableItems = items.filter( i => i.plot );
                const listableItems = items.filter( i => i.list );

                this.items = listableItems.map( this.formatItem );
                this.total = total;
                this.quantity = quantity;
                this.info = info;
                this.lastUpdate = lastUpdate;

                this.plotChart( plottableItems );
            } catch ( error ) {
                this.items = undefined;
                this.$scope.$apply();
            } finally {
                this.filter = filter;
                this.reportTitle = `Obras Contratadas ${filter.year}`;
            }
        }, 300 );
    }


    /**
     * 
     * 
     * @private
     * @param {string} state
     * @param {PublicWorksItem} item
     * 
     * @memberOf PublicWorksController
     */
    public openDetails( item: PublicWorksItem ): void {
        this.transitionService.changeState( 'app.secontTransparencyPublicWorksByCity', Object.assign( { cityId: item.id }, this.filter ) );
    }


    /**
     * 
     * 
     * @param {PublicWorksItem[]} items
     * 
     * @memberOf PublicWorksController
     */
    private plotChart( items: PublicWorksItem[] ): void {
        this.chart = {
            labels: items.map( item => item.label ),
            values: items.map( item => item.percentage ),
            colors: items.map( item => item.color )
        };
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf PublicWorksController
     */
    private formatItem( item: PublicWorksItem ): PublicWorksItem {
        return Object.assign( item, { label: `${item.label} (${item.quantity} obras)` });
    }
}


