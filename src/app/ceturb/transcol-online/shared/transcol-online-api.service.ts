import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { FavoriteStops, TranscolOnlineStorage, BusStop, Prevision } from './index';

const TIMEOUT = 10000;

/**
 * 
 * 
 * @export
 * @class CeturbApiService
 */
export class TranscolOnlineApiService {

    public static $inject: string[] = [ '$http', 'transcolOnlineStorage' ];

    
    /**
     * Creates an instance of TranscolOnlineApiService.
     * @param {IHttpService} http 
     * @param {TranscolOnlineStorage} storage 
     * 
     * @memberof TranscolOnlineApiService
     */
    constructor( private http: IHttpService, private storage: TranscolOnlineStorage ) { }



    /****************************** Transcol online *****************************/

    /**
     * 
     * 
     * @param {string} text 
     * @returns {Promise<BusStop[]>} 
     * 
     * @memberOf CeturbApiService
     */
    public async searchBusStops( text: string, originId: number | undefined ): Promise<BusStop[]> {
        const response: any = await this.searchBusStopsIds( text, originId );
        return await this.listBusStopsByIds( response.data.pontosDeParada );
    }


    /**
     * 
     * 
     * @param {string} text 
     * @param {(number | undefined)} originId 
     * @returns {Promise<number[]>} 
     * 
     * @memberof CeturbApiService
     */
    public async searchBusStopsIds( text: string, originId: number | undefined ): Promise<number[]> {
        const payload: any = { texto: text };
        if ( originId ) {
            payload.pontoDeOrigemId = originId;
        }
        const response: any = await this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/texto/pesquisarPontosDeParada`, payload );
        return await response.data.pontosDeParada;
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
    public getBusStopsIdsByOrigin( id: number ): Promise<any[]> {
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/json/db/pesquisarPontosDeParada`, { pontoDeOrigemId: id }, { timeout: TIMEOUT })
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
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/json/db/listarPontosDeParada`, { listaIds: ids } )
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
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/estimativas/obterEstimativasPorOrigemELinha`, { pontoDeOrigemId: originId, linhaId: lineId }, { timeout: TIMEOUT })
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
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/estimativas/obterEstimativasPorOrigemEDestino`, { pontoDeOrigemId: originId, pontoDeDestinoId: destinationId }, { timeout: TIMEOUT })
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
        return this.http.post( `https://api.es.gov.br/ceturb/transcolOnline/svc/estimativas/obterEstimativasPorOrigem`, { pontoDeOrigemId: id }, { timeout: TIMEOUT } )
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data );
    }


    /**
     * 
     * 
     * @param {boolean} [hasNewData=false] 
     * @returns {Promise<FavoriteStops>} 
     * 
     * @memberof TranscolOnlineApiService
     */
    public syncFavoriteStopsData( hasNewData: boolean = false ): Promise<FavoriteStops> {
        if ( hasNewData ) {
            this.storage.favoriteStops.date = new Date();
        }

        const payload = {
            id: this.storage.favoriteStops.id,
            items: this.storage.favoriteStops.items,
            date: this.storage.favoriteStops.date
        };

        return this.http
            .post( `https://api.es.gov.br/espm/ceturb/transcolOnline/data/favoriteStops`, payload, { headers: { 'Transparent': true } } )
            .then(( response: IHttpPromiseCallbackArg<FavoriteStops> ) => {
                this.storage.favoriteStops = response.data!;
                return response.data;
            })
            .catch(( error ) => {
                if ( this.storage.hasFavoriteStops ) {
                    return this.storage.favoriteStops;
                }
                throw error;
            });
    }
}
