import { IComponentController } from 'angular';

export class ReportListSummaryController implements IComponentController {

    public onSortClick: ( $event: { sort: string }) => void;
    public sort = 'desc';

    /**
     * 
     * 
     * @param {string} sort
     * 
     * @memberOf ReportListSummaryController
     */
    public toggleSort( sort: string ): void {
        this.sort = sort === 'asc' ? 'desc' : 'asc';
        this.onSortClick( { sort: this.sort });
    }
}
