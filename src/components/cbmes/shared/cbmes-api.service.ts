import { IHttpService, IPromise } from 'angular';
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
     * @returns {IPromise<Warning[]>}
     */
    public getLastWarnings(): IPromise<Warning[]> {
        return this.$http.get( `${this.settings.api.cbmes}/alerts` )
            .then(( response: { data: Warning[] }) => response.data );
    }
}
