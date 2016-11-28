import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { Edition, SearchResult, SearchFilter } from './models/index';
import { ISettings } from '../../shared/shared.module';

export class DioApiService {

    public static $inject: string[] = [ '$http', 'settings' ];

    /**
     * Creates an instance of DioApiService.
     * 
     * @param {IHttpService} $http
     * @param {ISettings} settings
     */
    constructor( private $http: IHttpService, private settings: ISettings ) { }


    /**
     * 
     * 
     * @returns {Promise<Edition[]>}
     */
    public getLatestEditions(): Promise<Edition[]> {
        return this.$http
            .get( `${this.settings.api.dio}/latest` )
            .then(( response: IHttpPromiseCallbackArg<Edition[]> ) => response.data );
    }

    /**
     * 
     * 
     * @param {SearchFilter} [filter={ pageNumber: 0, sort: 'date' }]
     * @returns {Promise<SearchResult>}
     */
    public search( filter: SearchFilter ): Promise<SearchResult> {

        let params = angular.extend( { pageNumber: this.settings.pagination.pageNumber, sort: 'date' }, filter );

        return this.$http.get( `${this.settings.api.dio}/search`, { params: params })
            .then(( response: IHttpPromiseCallbackArg<SearchResult> ) => {
                return response.data;
            });
    }
}

