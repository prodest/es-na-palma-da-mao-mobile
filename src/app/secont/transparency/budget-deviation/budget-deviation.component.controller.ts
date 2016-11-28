import { IScope } from 'angular';
import { YearFilter } from '../../../layout/layout.module';
import { ChartModel } from '../transparency.module';
import { BudgetDeviation, TransparencyApiService } from '../shared/index';

export class BudgetDeviationController {

    public static $inject: string[] = [ '$scope', 'transparencyApiService' ];

    public budgetDeviation: BudgetDeviation | undefined;
    public filter: YearFilter;
    public showFilter: boolean = false;
    public showChart: boolean = true;
    public chart: ChartModel | undefined;
    public chartPlugin: any;

    /**
     * Creates an instance of BudgetDeviationController.
     * 
     * @param {IScope} $scope
     * @param {TransparencyApiService} transparencyApiService
     * 
     * @memberOf BudgetDeviationController
     */
    constructor( private $scope: IScope, private transparencyApiService: TransparencyApiService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
        this.$scope.$on( '$ionicView.beforeEnter', () => this.registerChartPlugin() );
        this.$scope.$on( '$ionicView.beforeLeave', () => this.unregisterChartPlugin() );
    }


    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public activate() {
        this.doFilter( YearFilter.currentYear() );
    }

    /**
     * 
     * 
     * @param {Date} date
     * 
     * @memberOf BudgetDeviationController
     */
    public doFilter( filter: YearFilter ) {

        // inicia animação que fecha o filtro
        this.showFilter = false;

        // trick: espera 300ms que é o tempo da animação do filtro buscar os dados.
        // Impede que a tela congele, pois o processamento da animação do filtro 
        // conflita com a renderização dos items retornados(javascript single thread)
        window.setTimeout( async () => {
            try {
                this.budgetDeviation = await this.transparencyApiService.getBudgetDeviation( filter );
                this.plotChart( this.budgetDeviation );
            } catch ( error ) {
                this.budgetDeviation = undefined;
                this.$scope.$apply();
            } finally {
                this.filter = filter;
            }
        }, 300 );
    }



    /*************************************** Private API *******************************************************/

    /**
     * 
     * 
     * @private
     * @param {BudgetDeviationSummary} budgetDeviation
     * 
     * @memberOf BudgetDeviationController
     */
    private plotChart( budgetDeviation: BudgetDeviation ): void {
        const chartColors = {
            red: 'rgb(255, 99, 132)',
            blue: 'rgb(54, 162, 235)'
        };

        let color = Chart.helpers.color;

        this.chart = {
            values: [ [ 100 ], [ budgetDeviation.percentage ] ],
            override: [ {
                label: 'Orçado',
                backgroundColor: color( chartColors.red ).alpha( 0.5 ).rgbString(),
                borderColor: chartColors.red,
                borderWidth: 1
            }, {
                label: 'Executado',
                backgroundColor: color( chartColors.blue ).alpha( 0.5 ).rgbString(),
                borderColor: chartColors.blue,
                borderWidth: 1
            }]
        };
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf BudgetDeviationController
     */
    private registerChartPlugin(): void {
        this.chartPlugin = {
            afterDatasetsDraw: ( chartInstance, easing ) => {

                // To only draw at the end of animation, check for easing === 1
                let ctx = chartInstance.chart.ctx;

                chartInstance.data.datasets.forEach(( dataset, i ) => {

                    let meta = chartInstance.getDatasetMeta( i );

                    if ( !meta.hidden ) {

                        meta.data.forEach(( element, index ) => {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgb(255, 255, 255)';
                            let fontSize = 22;
                            let fontStyle = 'bold';
                            let fontFamily = 'Roboto';
                            ctx.font = Chart.helpers.fontString( fontSize, fontStyle, fontFamily );

                            let dataString = `${dataset.data[ index ].toString()}%`;

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            let position = element.tooltipPosition();
                            ctx.fillText( dataString, position.x / 2, position.y );
                        });
                    }
                });
            }
        };

        Chart.plugins.register( this.chartPlugin );
    }


    /**
     * 
     * 
     * @private
     * 
     * @memberOf BudgetDeviationController
     */
    private unregisterChartPlugin() {
        Chart.plugins.unregister( this.chartPlugin );
    }
}
