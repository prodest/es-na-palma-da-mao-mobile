import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { ISettings } from '../../shared/shared.module';
import { BusLine, BusRoute, BusSchedule, FavoriteLinesData, CeturbStorage, BusStop } from './index';

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
            .get( `${ this.settings.api.ceturb }/lines/` )
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
            .get( `${ this.settings.api.ceturb }/schedule/${ id }` )
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
            .get( `${ this.settings.api.ceturb }/route/${ id }` )
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
            .post( `${ this.settings.api.espm }/data/favoriteBusLines`, this.ceturbStorage.favoriteLines )
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






    /****************************** ponto ES *****************************/
    /**
     * 
     * 
     * @param {string} id
     * @returns {Promise<BusRoute>}
     */
    public getBusStopsByArea( bounds: number[] ): Promise<BusStop[]> {
        return this.http.post( 'https://api.es.gov.br/ceturb/buscabus/svc/json/db/pesquisarPontosDeParada', { envelope: bounds })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data.pontosDeParada )
            .then( ids => this.listBusStopsByIds( ids ) );
    }


    public getBusStopsByOrigin( id: number ): Promise<any[]> {
        return this.http.post( 'https://api.es.gov.br/ceturb/buscabus/svc/json/db/pesquisarPontosDeParada', { pontoDeOrigemId: id })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data.pontosDeParada )
            .then( ids => this.listBusStopsByIds( ids ) );
    }

    /**
         * 
         * 
         * @param {number[]} ids
         * @returns {Promise<BusRoute>}
         * 
         * @memberOf CeturbApiService
         */
    private listBusStopsByIds( ids: number[] ): Promise<BusStop[]> {
        return this.http.post( 'https://api.es.gov.br/ceturb/buscabus/svc/json/db/listarPontosDeParada', { listaIds: ids })
            .then(( response: IHttpPromiseCallbackArg<any> ) => {
                return this.formatBusStops( response.data.pontosDeParada );
            });
    }
    
    private formatBusStops( stops: BusStop[] ) {
        return stops.map( stop => {
            stop.isTerminal = /T[A-Z]{2,}/.test( stop.identificador );
            stop.isPonto = !stop.isTerminal;
            stop.tipo = stop.isTerminal ? 'terminal' : 'ponto';
            const [ logradouro, bairro, municipio ] = (stop.descricao || 'Descrição não informada').split( ' - ' );
            return Object.assign( stop, { bairro: bairro, logradouro, municipio });
        });
    }
}
