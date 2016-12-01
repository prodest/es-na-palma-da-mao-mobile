import { IScope } from 'angular';
import { YearFilter } from '../../../layout/layout.module';
import { ChartModel } from '../transparency.module';
import { PublicWorksByCitiesItem, TransparencyApiService } from '../shared/index';

export class PublicWorksByCitiesController {

    public static $inject: string[] = [ '$scope', 'transparencyApiService' ];

    public title: string;
    public showChart = true;
    public total: number;
    public quantity: number;
    public lastUpdate: string;
    public info: string;
    public items: PublicWorksByCitiesItem[] | undefined;
    public filter: YearFilter;
    public showFilter: boolean = false;
    public chart: ChartModel | undefined;


    /**
     * Creates an instance of PublicWorksByCitiesController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyApiService} transparencyApiService
     * 
     * @memberOf PublicWorksByCitiesController
     */
    constructor( private $scope: IScope, private transparencyApiService: TransparencyApiService ) {
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
     * @memberOf PublicWorksByCitiesController
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
            }
        }, 300 );
    }


    /**
     * 
     * 
     * @param {PublicWorksByCitiesItem[]} items
     * 
     * @memberOf PublicWorksByCitiesController
     */
    private plotChart( items: PublicWorksByCitiesItem[] ): void {
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
     * @memberOf PublicWorksByCitiesController
     */
    private formatItem( item: PublicWorksByCitiesItem ): PublicWorksByCitiesItem {
        return Object.assign( item, { label: `${item.label} (${item.quantity} obras)` });
    }
}

