import { IComponentController } from 'angular';
import { MoneyFlow, MoneyFlowItem } from '../models/index';
import { ChartModel } from '../../transparency.module';

export class MoneyFlowReportController implements IComponentController {

    public static $inject: string[] = [];

    public onItemClick: ( item: { item: MoneyFlowItem }) => void;
    public moneyFlow: MoneyFlow;
    public title: string;
    public showChart = true;
    public total: number;
    public lastUpdate: string;
    public info: string;
    public items: MoneyFlowItem[] | undefined;
    public chart: ChartModel | undefined = undefined;

    /**
     * Creates an instance of MoneyFlowController.
     * 
     * 
     * @memberOf MoneyFlowController
     */
    constructor() { }

    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public $onChanges( changes ): void {

        if ( changes.moneyFlow ) {
            const moneyFlow = angular.copy( changes.moneyFlow.currentValue ) as MoneyFlow;
            if ( moneyFlow ) {
                this.items = moneyFlow.items.filter( i => i.list );
                this.total = moneyFlow.total;
                this.info = moneyFlow.info;
                this.lastUpdate = moneyFlow.lastUpdate;
                this.plotChart( moneyFlow.items.filter( i => i.plot ) );
            }
        }
        if ( changes.title ) {
            this.title = angular.copy( changes.title.currentValue );
        }
    }

    /**
     * 
     * 
     * @param {SummaryItem[]} items
     * 
     * @memberOf MoneyFlowController
     */
    public plotChart( items: MoneyFlowItem[] ): void {
        this.chart = {
            labels: items.map( item => item.label ),
            values: items.map( item => item.percentage ),
            colors: items.map( item => item.color )
        };
    }

    /**
     * 
     * 
     * @type {void}
     * @memberOf MoneyFlowController
     */
    public toggleChart(): void {
        this.showChart = !this.showChart;
    }

    /**
     * 
     * 
     * @param {number} originId
     * 
     * @memberOf MoneyFlowController
     */
    public onClick( item: MoneyFlowItem ) {
        this.onItemClick( { item: item });
    }
}
