import { IScope } from 'angular';
import { YearFilter } from '../../../layout/layout.module';
import { ChartModel } from '../transparency.module';
import { PublicWorksByCityItem, TransparencyApiService } from '../shared/index';

export class PublicWorksByCityController {

    public static $inject: string[] = [ '$scope', 'transparencyApiService' ];

    public title: string;
    public showChart = true;
    public total: number;
    public quantity: number;
    public lastUpdate: string;
    public info: string;
    public items: PublicWorksByCityItem[] | undefined;
    public filter: YearFilter;
    public showFilter: boolean = false;
    public chart: ChartModel | undefined;


    /**
     * Creates an instance of PublicWorksByCityController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyApiService} transparencyApiService
     * 
     * @memberOf PublicWorksByCityController
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
     * @memberOf PublicWorksByCityController
     */
    public doFilter( filter: YearFilter ) {

        // inicia animação que fecha o filtro
        this.showFilter = false;

        // trick: espera 300ms que é o tempo da animação do filtro buscar os dados.
        // Impede que a tela congele, pois o processamento da animação do filtro 
        // conflita com a renderização dos items retornados(javascript single thread)
        window.setTimeout( async () => {
            try {
                const summary = await this.transparencyApiService.getPublicWorksByCity( filter );
                this.items = summary.items.filter( i => i.list );
                this.total = summary.total;
                this.quantity = summary.quantity;
                this.info = summary.info;
                this.lastUpdate = summary.lastUpdate;
                this.plotChart( summary.items.filter( i => i.plot ) );
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
     * @param {PublicWorksByCityItem[]} items
     * 
     * @memberOf PublicWorksByCityController
     */
    public plotChart( items: PublicWorksByCityItem[] ): void {
        this.chart = {
            labels: items.map( item => item.label ),
            values: items.map( item => item.percentage ),
            colors: items.map( item => item.color )
        };
    }
}

