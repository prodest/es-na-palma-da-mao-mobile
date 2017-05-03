import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { ISettings } from '../../shared/shared.module';
import { BusLine, BusRoute, BusSchedule, FavoriteLinesData, CeturbStorage, BusStop, Prevision } from './index';

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
            .post( `${ this.settings.api.ceturb }/data/favoriteBusLines`, this.ceturbStorage.favoriteLines )
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






    /****************************** Transcol online *****************************/

    /**
     * 
     * 
     * @param {string} text 
     * @returns {Promise<BusStop[]>} 
     * 
     * @memberOf CeturbApiService
     */
    public async searchBusStops( text: string ): Promise<BusStop[]> {
        const response: any = await this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/texto/pesquisarPontosDeParada`, { texto: text });
        return await this.listBusStopsByIds( response.data.pontosDeParada );
    }


    /**
     * 
     * 
     * @param {number} originId 
     * @param {number} destinationId 
     * @returns {Promise<BusStop[]>} 
     * 
     * @memberOf CeturbApiService
     */
    public async getBusStopsIdsByRoute( originId: number, destinationId: number ): Promise<number[]> {
        const response: any = await this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/json/db/pesquisarPontosDeParada`, { pontoDeOrigemId: originId, pontoDeDestinoId: destinationId }, { headers: { 'Transparent': true } });
        return response.data.pontosDeParada;
    }


    /**
     * 
     * 
     * @param {string} id
     * @returns {Promise<BusRoute>}
     */
    public getBusStopsByArea( bounds: number[] ): Promise<BusStop[]> {
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/json/db/pesquisarPontosDeParada`, { envelope: bounds })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data.pontosDeParada )
            .then( ids => this.listBusStopsByIds( ids ) );
    }

    /**
     * 
     * 
     * @param {number} id 
     * @returns {Promise<any[]>} 
     * 
     * @memberOf CeturbApiService
     */
    public getBusStopsByOrigin( id: number ): Promise<BusStop[]> {
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/json/db/pesquisarPontosDeParada`, { pontoDeOrigemId: id })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data.pontosDeParada )
            .then( ids => this.listBusStopsByIds( ids ) );
    }

    /**
     * 
     * 
     * @param {number} id 
     * @returns {Promise<any[]>} 
     * 
     * @memberOf CeturbApiService
     */
    public getBusStopsIdsByOrigin( id: number ): Promise<any[]> {
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/json/db/pesquisarPontosDeParada`, { pontoDeOrigemId: id })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data.pontosDeParada );
    }

    /**
     * 
     * 
     * @private
     * @param {number[]} ids 
     * @returns {Promise<BusStop[]>} 
     * 
     * @memberof CeturbApiService
     */
    private listBusStopsByIds( ids: number[] ): Promise<BusStop[]> {
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/json/db/listarPontosDeParada`, { listaIds: ids })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data );
    }

    /**
     *
     *
     * @param {number} originId 
     * @param {number} lineId 
     * @returns {Promise<Prevision[]>} 
     * 
     * @memberOf CeturbApiService
     */
    public getPrevisionsByOriginAndLine( originId: number, lineId: number ): Promise<Prevision[]> {
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/estimativas/obterEstimativasPorOrigemELinha`, { pontoDeOrigemId: originId, linhaId: lineId })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data );
    }

    /**
     * 
     * 
     * @param {number} originId 
     * @param {number} destinationId 
     * @returns {Promise<Prevision[]>} 
     * 
     * @memberOf CeturbApiService
     */
    public getPrevisionsByOriginAndDestination( originId: number, destinationId: number ): Promise<Prevision[]> {
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/estimativas/obterEstimativasPorOrigemEDestino`, { pontoDeOrigemId: originId, pontoDeDestinoId: destinationId })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data );
    }

    /**
     * 
     * 
     * @param {number} id 
     * @returns {Promise<Prevision[]>} 
     * 
     * @memberOf CeturbApiService
     */
    public getPrevisionsByOrigin( id: number ): Promise<Prevision[]> {
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/estimativas/obterEstimativasPorOrigem`, { pontoDeOrigemId: id })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data );
    }
}
