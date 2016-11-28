import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { ISettings } from '../../shared/shared.module';
import { BusLine, BusRoute, BusSchedule, FavoriteLinesData, CeturbStorage } from './index';

/**
 * 
 * 
 * @export
 * @class CeturbApiService
 */
export class CeturbApiService {

    public static $inject: string[] = [ '$http', 'settings', 'ceturbStorage' ];

    /**
     * Creates an instance of CeturbApiService.
     * 
     * @param {IHttpService} http
     * @param {ISettings} settings
     * @param {CeturbStorage} ceturbStorage
     * 
     * @memberOf CeturbApiService
     */
    constructor( private http: IHttpService, private settings: ISettings, private ceturbStorage: CeturbStorage ) {
    }

    /**
     * 
     * 
     * @param {string} filter
     * @returns {Promise<BusLine[]>}
     */
    public getLines(): Promise<BusLine[]> {
        return this.http
            .get( `${this.settings.api.ceturb}/lines/` )
            .then(( response: IHttpPromiseCallbackArg<BusLine[]> ) => response.data );
    }

    /**
     * 
     * 
     * @param {string} id
     * @returns {Promise<BusSchedule>}
     */
    public getSchedule( id: string = '' ): Promise<BusSchedule> {
        return this.http
            .get( `${this.settings.api.ceturb}/schedule/${id}` )
            .then(( response: IHttpPromiseCallbackArg<BusSchedule> ) => response.data );
    }

    /**
     * 
     * 
     * @param {string} id
     * @returns {Promise<BusRoute>}
     */
    public getRoute( id: string = '' ): Promise<BusRoute> {
        return this.http
            .get( `${this.settings.api.ceturb}/route/${id}` )
            .then(( response: IHttpPromiseCallbackArg<BusRoute> ) => response.data );
    }

    /**
     * 
     * 
     * @param {boolean} [hasNewData=false]
     * @returns {Promise<FavoriteLinesData>}
     * 
     * @memberOf CeturbApiService
     */
    public syncFavoriteLinesData( hasNewData: boolean = false ): Promise<FavoriteLinesData> {
        if ( hasNewData ) {
            this.ceturbStorage.favoriteLines.date = new Date();
        }
        return this.http
            .post( `${this.settings.api.espm}/data/favoriteBusLines`, this.ceturbStorage.favoriteLines )
            .then(( response: IHttpPromiseCallbackArg<FavoriteLinesData> ) => {
                this.ceturbStorage.favoriteLines = response.data!;
                return response.data;
            })
            .catch(( error ) => {
                if ( this.ceturbStorage.hasFavoriteLines ) {
                    return this.ceturbStorage.favoriteLines;
                }
                throw error;
            });
    }
}
