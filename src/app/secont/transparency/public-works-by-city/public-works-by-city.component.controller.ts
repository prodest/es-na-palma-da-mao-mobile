import { IScope } from 'angular';
import { TransitionService } from '../../../shared/shared.module';
import { YearFilter } from '../../../layout/layout.module';
import { ChartModel } from '../transparency.module';
import { PublicWorksByCityItem, TransparencyApiService } from '../shared/index';

export class PublicWorksByCityController {

    public static $inject: string[] = [ '$scope', '$stateParams', 'transparencyApiService', 'transitionService' ];

    public reportTitle: string | undefined;
    public cityId: number;
    public city: string;
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
     * @param {angular.ui.IStateParamsService} $stateParams
     * @param {TransparencyApiService} transparencyApiService
     * @param {TransitionService} transitionService
     * 
     * @memberOf PublicWorksByCityController
     */
    constructor( private $scope: IScope,
        private $stateParams: angular.ui.IStateParamsService,
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
        this.hydrateFromParams( this.$stateParams );
        this.doFilter( this.cityId, this.filter );
    }

    /**
     * 
     * 
     * @param {number} cityId
     * @param {YearFilter} filter
     * 
     * @memberOf PublicWorksByCityController
     */
    public doFilter( cityId: number, filter: YearFilter ) {

        // inicia animação que fecha o filtro
        this.showFilter = false;

        // trick: espera 300ms que é o tempo da animação do filtro buscar os dados.
        // Impede que a tela congele, pois o processamento da animação do filtro 
        // conflita com a renderização dos items retornados(javascript single thread)
        window.setTimeout( async () => {
            try {
                const { city, total, info, items, lastUpdate  } = await this.transparencyApiService.getPublicWorksByCity( cityId, filter );

                const plottableItems = items.filter( i => i.plot );
                const listableItems = items.filter( i => i.list );

                this.city = city;
                this.items = listableItems;
                this.quantity = this.items.length;
                this.total = total;
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
     * @protected
     * @param {*} { cityId, label, year }
     * 
     * @memberOf PublicWorksByCityController
     */
    protected hydrateFromParams( { cityId, label, year }: any ) {
        this.cityId = cityId;
        this.title = label;
        this.filter = new YearFilter( +year );
    }


    /**
     * 
     * 
     * @param {PublicWorksByCityItem} item
     * 
     * @memberOf PublicWorksByCityController
     */
    public openDetails( item: PublicWorksByCityItem ): void {
        this.transitionService.changeState( 'app.secontTransparencyPublicWorksDetail', { id: item.id });
    }

    /**
     * 
     * 
     * @param {PublicWorksByCityItem[]} items
     * 
     * @memberOf PublicWorksByCityController
     */
    private plotChart( items: PublicWorksByCityItem[] ): void {
        this.chart = {
            labels: items.map( item => item.label ),
            values: items.map( item => item.percentage ),
            colors: items.map( item => item.color )
        };
    }
}

