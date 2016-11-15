import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { Process } from './models/index';
import { ISettings } from '../../shared/settings/index';

export class SepApiService {

    public static $inject: string[] = [ '$http', 'settings' ];

    /**
     * Creates an instance of SepApiService.
     * 
     * @param {IHttpService} $http
     * @param {ISettings} settings
     */
    constructor( private $http: IHttpService, private settings: ISettings ) { }

    /**
     * 
     * 
     * @param {number} procNumber
     * @returns {Promise<Process>}
     * 
     * @memberOf SepApiService
     */
    public getProcessByNumber( procNumber: number ): Promise<Process> {
        return this.$http.get( `${this.settings.api.sep}/${procNumber}` )
            .then(( response: IHttpPromiseCallbackArg<Process> ) => {
                if ( response.data ) {
                    response.data.updates = response.data.updates || [];
                }
                return response.data;
            });
    }
}
