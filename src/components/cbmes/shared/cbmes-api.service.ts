import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { ISettings } from '../../shared/settings/index';
import { Warning } from './models/index';

export class CbmesApiService {

    public static $inject: string[] = [ '$http', 'settings' ];


    /**
     * Creates an instance of CbmesApiService.
     * 
     * @param {IHttpService} $http
     * @param {ISettings} settings
     */
    constructor( private $http: IHttpService, private settings: ISettings ) {
    }

    /**
     * 
     * 
     * @returns {Promise<Warning[]>}
     */
    public getLastWarnings(): Promise<Warning[]> {
        return this.$http.get( `${this.settings.api.cbmes}/alerts` )
            .then(( response: IHttpPromiseCallbackArg<Warning[]> ) => response.data );
    }
}
