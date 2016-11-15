import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { ISettings } from '../../shared/settings/index';
import { News, NewsDetail, Filter, Pagination } from '../shared/models/index';

export class NewsApiService {

    public static $inject: string[] = [ '$http', 'settings' ];

    /**
     * Creates an instance of NewsApiService.
     * 
     * @param {IHttpService} $http
     * @param {ISettings} settings
     */
    constructor( private $http: IHttpService, private settings: ISettings ) {
    }

    /**
     *
     * @returns {*}
     */
    public getNewsById( id: string ): Promise<NewsDetail> {
        return this.$http
            .get( `${this.settings.api.news}/${id}` )
            .then(( response: IHttpPromiseCallbackArg<NewsDetail> ) => response.data );
    }

    /**
     *
     * @returns {*}
     */
    public getHighlightNews(): Promise<News[]> {
        return this.$http
            .get( `${this.settings.api.news}/highlights` )
            .then(( response: IHttpPromiseCallbackArg<News[]> ) => response.data );
    }

    /**
     *
     * @param calendars
     * @param options
     * @returns {Array}
     */
    public getNews( filter: Filter, pagination: Pagination ): Promise<News[]> {
        let defaults = {
            origins: [],
            pageNumber: this.settings.pagination.pageNumber,
            pageSize: this.settings.pagination.pageSize
        };

        let params = angular.extend( {}, defaults, filter, pagination );

        return this.$http.get( this.settings.api.news, { params: params })
            .then(( response: IHttpPromiseCallbackArg<News[]> ) => {
                return response.data;
            });
    }

    /**
     *
     * @returns {*}
     */
    public getAvailableOrigins(): Promise<string[]> {
        return this.$http
            .get( `${this.settings.api.news}/origins` )
            .then(( response: IHttpPromiseCallbackArg<string[]> ) => response.data );
    }
}
