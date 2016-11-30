import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { ISettings } from '../../../shared/shared.module';
import { DateRangeFilter, YearFilter } from '../../../layout/layout.module';
import { MoneyFlow, BudgetDeviation, PublicWorksByCity } from './models/index';

export class TransparencyApiService {

    public static $inject: string[] = [ '$http', 'settings' ];


    /**
     * Creates an instance of TransparencyApiService.
     * 
     * @param {IHttpService} $http
     * @param {ISettings} settings
     * 
     * @memberOf TransparencyApiService
     */
    constructor( private $http: IHttpService, private settings: ISettings ) { }


    /**
     * 
     * 
     * @param {YearFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf TransparencyApiService
     */
    public getBudgets( filter: YearFilter ): Promise<MoneyFlow> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/budgets/expected`, filter );
    }


    /**
     * 
     * 
     * @param {DateRangeFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf TransparencyApiService
     */
    public getRevenues( filter: DateRangeFilter ): Promise<MoneyFlow> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/revenues/area`, filter );
    }



    /**
     * 
     * 
     * @param {string} id
     * @param {DateRangeFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf TransparencyApiService
     */
    public getRevenueDetail( id: string, filter: DateRangeFilter ): Promise<MoneyFlow> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/revenues/detail/${id}`, filter );
    }



    /**
     * 
     * 
     * @param {DateRangeFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf TransparencyApiService
     */
    public getExpensesByArea( filter: DateRangeFilter ): Promise<MoneyFlow> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/expenses/area`, filter );
    }



    /**
     * 
     * 
     * @param {DateRangeFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf TransparencyApiService
     */
    public getExpensesByOrigin( filter: DateRangeFilter ): Promise<MoneyFlow> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/expenses/origin`, filter );
    }



    /**
     * 
     * 
     * @param {string} id
     * @param {DateRangeFilter} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf TransparencyApiService
     */
    public getExpenseDetail( id: string, filter: DateRangeFilter ): Promise<MoneyFlow> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/expenses/detail/${id}`, filter );
    }


    /**
     * 
     * 
     * @private
     * @param {string} endpoint
     * @param {(DateRangeFilter | YearFilter)} filter
     * @returns {Promise<MoneyFlow>}
     * 
     * @memberOf TransparencyApiService
     */
    private getMoneyFlow( endpoint: string, filter: DateRangeFilter | YearFilter ): Promise<MoneyFlow> {
        return this.$http
            .get( endpoint, { params: Object.assign( {}, filter ) })
            .then(( response: IHttpPromiseCallbackArg<MoneyFlow> ) => response.data );
    }

    /**
     * 
     * 
     * @param {YearFilter} filter
     * @returns {Promise<BudgetDeviationSummary>}
     * 
     * @memberOf TransparencyApiService
     */
    public getBudgetDeviation( filter: YearFilter ): Promise<BudgetDeviation> {
        return this.$http
            .get( `${this.settings.api.transparency}/budgets/deviation`, { params: Object.assign( {}, filter ) })
            .then(( response: IHttpPromiseCallbackArg<BudgetDeviation> ) => response.data );
    }


    /**
     * 
     * 
     * @param {YearFilter} filter
     * @returns {Promise<PublicWorksByCity>}
     * 
     * @memberOf TransparencyApiService
     */
    public getPublicWorksByCity( filter: YearFilter ): Promise<PublicWorksByCity> {
        return this.$http
            .get( `${this.settings.api.transparency}/public-works/by-city`, { params: Object.assign( {}, filter ) })
            .then(( response: IHttpPromiseCallbackArg<PublicWorksByCity> ) => response.data );
    }
}

