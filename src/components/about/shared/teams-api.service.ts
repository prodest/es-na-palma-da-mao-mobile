import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { TeamMember } from './models/index';

export class TeamsApiService {

    public static $inject: string[] = [ '$http' ];

    /**
     * Creates an instance of TeamsApiService.
     * 
     * @param {IHttpService} $http
     * 
     * @memberOf TeamsApiService
     */
    constructor( private $http: IHttpService ) { }

    /**
     *
     * @returns {*}
     */
    public getTeamMembers(): Promise<TeamMember[]> {
        return this.$http.get( 'https://api.es.gov.br/espm/about/team' ).then(( response: IHttpPromiseCallbackArg<TeamMember[]> ) => {
            return response.data;
        });
    }
}
