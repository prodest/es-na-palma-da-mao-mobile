import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { Summary, SummaryItem } from './models/index';
import { ISettings } from '../../../shared/settings/index';
import { DateRangeFilter } from '../../../layout/index';

const budgets = {
    total: 9560899999,
    info: 'Info de Teste',
    lastUpdate: new Date().toDateString(),
    items: <SummaryItem[]>[
        { originId: '123', label: 'Administração Geral a Cargo da Sefaz do Secretaria da Casa Civil', value: 22333555.00, percentage: 22, color: '#8abe66', list: true, plot: true },
        { originId: '123', label: 'Administração Geral a Cargo da Seger', value: 15666.00, percentage: 15, color: '#607D8B', list: true, plot: true },
        { originId: '123', label: 'Administração Geral a Cargo da Sep', value: 3009.00, percentage: 3, color: '#FFC107', list: true, plot: true },
        { originId: '123', label: 'Secretaria da Casa Civil', value: 3345678990.00, percentage: 33, color: '#f44336', list: true, plot: true },
        { originId: '123', label: 'Secretaria de Estado da Cultura', value: 500.00, percentage: 5, color: '#009688', list: true, plot: true },
        { originId: '123', label: 'Secretaria de Comunicação', value: 20.00, percentage: 2, color: '#FF9800', list: true, plot: true },
        { originId: '123', label: 'Administração Geral a Cargo da Sefaz', value: 16000000000.00, percentage: 1, color: '#8abe66', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Seger', value: 6000000000.00, percentage: 3, color: '#607D8B', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sep', value: 4000000000.00, percentage: 2, color: '#FFC107', list: true, plot: false },
        { originId: '123', label: 'Secretaria da Casa Civil', value: 3000000000.00, percentage: 1, color: '#f44336', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Estado da Cultura', value: 1000000000.00, percentage: 1, color: '#009688', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Comunicação', value: 1000000000.00, percentage: 0.1, color: '#FF9800', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sefaz', value: 16000000000.00, percentage: 1, color: '#8abe66', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Seger', value: 6000000000.00, percentage: 3, color: '#607D8B', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sep', value: 4000000000.00, percentage: 2, color: '#FFC107', list: true, plot: false },
        { originId: '123', label: 'Secretaria da Casa Civil', value: 3000000000.00, percentage: 1, color: '#f44336', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Estado da Cultura', value: 1000000000.00, percentage: 1, color: '#009688', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Comunicação', value: 1000000000.00, percentage: 0.1, color: '#FF9800', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sefaz', value: 16000000000.00, percentage: 1, color: '#8abe66', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Seger', value: 6000000000.00, percentage: 3, color: '#607D8B', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sep', value: 4000000000.00, percentage: 2, color: '#FFC107', list: true, plot: false },
        { originId: '123', label: 'Secretaria da Casa Civil', value: 3000000000.00, percentage: 1, color: '#f44336', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Estado da Cultura', value: 1000000000.00, percentage: 1, color: '#009688', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Comunicação', value: 1000000000.00, percentage: 0.1, color: '#FF9800', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sefaz', value: 16000000000.00, percentage: 1, color: '#8abe66', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Seger', value: 6000000000.00, percentage: 3, color: '#607D8B', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sep', value: 4000000000.00, percentage: 2, color: '#FFC107', list: true, plot: false },
        { originId: '123', label: 'Secretaria da Casa Civil', value: 3000000000.00, percentage: 1, color: '#f44336', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Estado da Cultura', value: 1000000000.00, percentage: 1, color: '#009688', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Comunicação', value: 1000000000.00, percentage: 0.1, color: '#FF9800', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sefaz', value: 16000000000.00, percentage: 1, color: '#8abe66', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Seger', value: 6000000000.00, percentage: 3, color: '#607D8B', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sep', value: 4000000000.00, percentage: 2, color: '#FFC107', list: true, plot: false },
        { originId: '123', label: 'Secretaria da Casa Civil', value: 3000000000.00, percentage: 1, color: '#f44336', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Estado da Cultura', value: 1000000000.00, percentage: 1, color: '#009688', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Comunicação', value: 1000000000.00, percentage: 0.1, color: '#FF9800', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sefaz', value: 16000000000.00, percentage: 1, color: '#8abe66', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Seger', value: 6000000000.00, percentage: 3, color: '#607D8B', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sep', value: 4000000000.00, percentage: 2, color: '#FFC107', list: true, plot: false },
        { originId: '123', label: 'Secretaria da Casa Civil', value: 3000000000.00, percentage: 1, color: '#f44336', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Estado da Cultura', value: 1000000000.00, percentage: 1, color: '#009688', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Comunicação', value: 1000000000.00, percentage: 0.1, color: '#FF9800', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sefaz', value: 16000000000.00, percentage: 1, color: '#8abe66', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Seger', value: 6000000000.00, percentage: 3, color: '#607D8B', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sep', value: 4000000000.00, percentage: 2, color: '#FFC107', list: true, plot: false },
        { originId: '123', label: 'Secretaria da Casa Civil', value: 3000000000.00, percentage: 1, color: '#f44336', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Estado da Cultura', value: 1000000000.00, percentage: 1, color: '#009688', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Comunicação', value: 1000000000.00, percentage: 0.1, color: '#FF9800', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sefaz', value: 16000000000.00, percentage: 1, color: '#8abe66', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Seger', value: 6000000000.00, percentage: 3, color: '#607D8B', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sep', value: 4000000000.00, percentage: 2, color: '#FFC107', list: true, plot: false },
        { originId: '123', label: 'Secretaria da Casa Civil', value: 3000000000.00, percentage: 1, color: '#f44336', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Estado da Cultura', value: 1000000000.00, percentage: 1, color: '#009688', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Comunicação', value: 1000000000.00, percentage: 0.1, color: '#FF9800', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sefaz', value: 16000000000.00, percentage: 1, color: '#8abe66', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Seger', value: 6000000000.00, percentage: 3, color: '#607D8B', list: true, plot: false },
        { originId: '123', label: 'Administração Geral a Cargo da Sep', value: 4000000000.00, percentage: 2, color: '#FFC107', list: true, plot: false },
        { originId: '123', label: 'Secretaria da Casa Civil', value: 3000000000.00, percentage: 1, color: '#f44336', list: true, plot: false },
        { originId: '123', label: 'Secretaria de Estado da Cultura', value: 1000000000.00, percentage: 1, color: '#009688', list: true, plot: false }
    ]
};

export class TransparencyApiService {

    public static $inject: string[] = [ '$http', 'settings' ];

    /**
     * Creates an instance of DioApiService.
     * 
     * @param {IHttpService} $http
     * @param {ISettings} settings
     */
    constructor( private $http: IHttpService, private settings: ISettings ) { }


    public getBudgets( filter: DateRangeFilter ): Promise<Summary> {
        return Promise.resolve( budgets );
        // this.getMoneyFlow( `${this.settings.api.transparency}/budgets`, filter );
    }

    /**
    * 
    * 
    * @returns {Promise<Summary>}
    * 
    * @memberOf TransparencyService
    */
    public getRevenues( filter: DateRangeFilter ): Promise<Summary> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/revenues/area`, filter );
    }

    /**
     * 
     * 
     * @returns {Promise<Edition[]>}
     */
    public getRevenueDetail( id: string, filter: DateRangeFilter ): Promise<Summary> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/revenues/detail/${id}`, filter );
    }

    /**
     * 
     * 
     * @returns {Promise<Summary>}
     * 
     * @memberOf TransparencyService
     */
    public getExpensesByArea( filter: DateRangeFilter ): Promise<Summary> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/expenses/area`, filter );
    }

    /**
     * 
     * 
     * @returns {Promise<Summary>}
     * 
     * @memberOf TransparencyService
     */
    public getExpensesByOrigin( filter: DateRangeFilter ): Promise<Summary> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/expenses/origin`, filter );
    }

    /**
     * 
     * 
     * @param {string} revenueId
     * @returns {Promise<Summary>}
     * 
     * @memberOf TransparencyService
     */
    public getExpenseDetail( id: string, filter: DateRangeFilter ): Promise<Summary> {
        return this.getMoneyFlow( `${this.settings.api.transparency}/expenses/detail/${id}`, filter );
    }

    /**
     * 
     * 
     * @private
     * @param {string} endpoint
     * @param {DateRangeFilter} filter
     * @returns {Promise<Summary>}
     * 
     * @memberOf TransparencyService
     */
    private getMoneyFlow( endpoint: string, filter: DateRangeFilter ): Promise<Summary> {
        return this.$http
            .get( endpoint, { params: Object.assign( {}, filter ) })
            .then(( response: IHttpPromiseCallbackArg<Summary> ) => response.data );
    }
}

