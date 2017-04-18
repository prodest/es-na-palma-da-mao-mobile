import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { Process, FavoriteProcessData } from './models/index';
import { ISettings } from '../../shared/shared.module';
import { SepStorageService } from './index';

export class SepApiService {

    public static $inject: string[] = [ '$http', 'settings', 'sepStorageService' ];

    /**
     * Creates an instance of SepApiService.
     * 
     * @param {IHttpService} $http
     * @param {ISettings} settings
     */
    constructor( private $http: IHttpService, private settings: ISettings, private sepStorage: SepStorageService ) { }

    /**
     * 
     * 
     * @param {number} procNumber
     * @returns {Promise<Process>}
     * 
     * @memberOf SepApiService
     */
    public getProcessByNumber ( procNumber: string ): Promise<Process> {
        return this.$http.get( `${this.settings.api.sep}/${procNumber}` )
            .then(( response: IHttpPromiseCallbackArg<Process> ) => {
                if ( response.data ) {
                    response.data.updates = response.data.updates || [];
                }
                return response.data;
            } );
    }

    public syncFavoriteProcessData ( hasNewData: boolean = false ): Promise<FavoriteProcessData> {
        if ( hasNewData ) {
            this.sepStorage.favoriteProcess.date = new Date();
        }
        return this.$http
            .post( `${this.settings.api.espm}/sep/data/favorite`, this.sepStorage.favoriteProcess )
            .then(( response: IHttpPromiseCallbackArg<FavoriteProcessData> ) => {
                this.sepStorage.favoriteProcess = response.data!;
                return response.data;
            } )
            .catch(( error ) => {
                if ( this.sepStorage.hasFavoriteProcess ) {
                    return this.sepStorage.favoriteProcess;
                }
                throw error;
            } );
    }
}
