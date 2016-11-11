import { Summary, SummaryItem, Chart } from '../index';

export class ReportController {

    public static $inject: string[] = [];

    public onItemClick: ( item: { item: SummaryItem }) => void;
    public summary: Summary;
    public title: string;
    public showChart = true;
    public sortDesc = false;
    public total: number;
    public lastUpdate: string;
    public info: string;
    public items: SummaryItem[] | undefined;
    public chart: Chart | undefined = undefined;

    /**
     * Creates an instance of ReportController.
     * 
     * 
     * @memberOf ReportController
     */
    constructor() { }

    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public $onChanges( changes ): void {

        if ( changes.summary ) {
            const summary = <Summary>changes.summary.currentValue;
            if ( summary ) {
                this.items = summary.items.filter( i => i.list );
                this.total = summary.total;
                this.info = summary.info;
                this.lastUpdate = summary.lastUpdate;
                this.plotChart( summary.items.filter( i => i.plot ) );
            }
        }
        if ( changes.title ) {
            this.title = changes.title.currentValue;
        }
    }

    /**
     * 
     * 
     * @param {SummaryItem[]} items
     * 
     * @memberOf ExpensesController
     */
    public plotChart( items: SummaryItem[] ): void {
        this.chart = {
            labels: items.map( item => item.label ),
            values: items.map( item => item.percentage ),
            colors: items.map( item => item.color )
        };
    }

    /**
     * 
     * 
     * 
     * @memberOf ExpensesController
     */
    public toggleSort(): void {
        this.sortDesc = !this.sortDesc;
    }

    /**
     * 
     * 
     * @type {void}
     * @memberOf ExpensesController
     */
    public toggleChart(): void {
        this.showChart = !this.showChart;
    }

    /**
     * 
     * 
     * @param {number} originId
     * 
     * @memberOf ExpensesController
     */
    public onClick( item: SummaryItem ) {
        this.onItemClick( { item: item });
    }
}
