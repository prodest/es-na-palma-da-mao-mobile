import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import moment = require( 'moment' );
import { ISettings } from '../../shared/shared.module';
import { BusLine, BusRoute, BusSchedule, FavoriteLinesData, CeturbStorage, BusStop, Prevision } from './index';
import * as _ from 'lodash';
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






    /****************************** TTranscol online *****************************/

    /**
     * 
     * 
     * @param {string} text 
     * @returns {Promise<BusStop[]>} 
     * 
     * @memberOf CeturbApiService
     */
    public async searchBusStops( text: string ): Promise<BusStop[]> {
        const response: any = await this.http.post( 'https://api.es.gov.br/ceturb/buscabus/svc/texto/pesquisarPontosDeParada', { texto: text } );
        return await this.listBusStopsByIds( response.data.pontosDeParada );
    }

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

    /**
     * 
     * 
     * @param {number} id 
     * @returns {Promise<any[]>} 
     * 
     * @memberOf CeturbApiService
     */
    public getBusStopsByOrigin( id: number ): Promise < BusStop[]> {
        return this.http.post( 'https://api.es.gov.br/ceturb/buscabus/svc/json/db/pesquisarPontosDeParada', { pontoDeOrigemId: id })
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
        return this.http.post( 'https://api.es.gov.br/ceturb/buscabus/svc/json/db/pesquisarPontosDeParada', { pontoDeOrigemId: id })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data.pontosDeParada );
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
        return this.previsions( this.http.post( 'https://api.es.gov.br/ceturb/buscabus/svc/estimativas/obterEstimativasPorOrigemELinha', { pontoDeOrigemId: originId, linhaId: lineId }) );
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
        return this.previsions( this.http.post( 'https://api.es.gov.br/ceturb/buscabus/svc/estimativas/obterEstimativasPorOrigemEDestino', { pontoDeOrigemId: originId, pontoDeDestnoId: destinationId }) );
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
        return this.groupedPrevisions( this.http.post( 'https://api.es.gov.br/ceturb/buscabus/svc/estimativas/obterEstimativasPorOrigem', { pontoDeOrigemId: id }) );
    }
  
    /**
     * 
     * 
     * @private
     * @param {Promise<any>} whenLoaded 
     * @returns {Promise<Prevision[]>} 
     * 
     * @memberOf CeturbApiService
     */
    private groupedPrevisions( whenLoaded: Promise<any> ): Promise<Prevision[]> {
        return whenLoaded.then(( response: IHttpPromiseCallbackArg<any> ) => response.data )
            .then(( { horarioDoServidor, estimativas, pontoDeOrigemId }) => {

                const previsions = _.chain( estimativas )
                    .sortBy( 'horarioNaOrigem' )
                    .groupBy( 'itinerarioId' )
                    .valuesIn()
                    .map( values => values[ 0 ] )
                    .value();

                const itinerariesIds = previsions.map( e => e.itinerarioId );

                return this.listItinerariesByIds( itinerariesIds )
                    .then(( { itinerarios }) => {
                        const itinerariesMap = _.keyBy( itinerarios, 'id' );
                        return _.chain( previsions )
                            .map( e => this.createFullPrevision( e, itinerariesMap[ e.itinerarioId ], horarioDoServidor, pontoDeOrigemId ) )
                            .sortBy( 'previsaoEmMinutos' )
                            .groupBy( 'identificadorLinha' )
                            .valuesIn()
                            .map( values => values[ 0 ] )
                            .sortBy( 'previsaoEmMinutos' )
                            .value();
                    });
            });
    }

    /**
     * 
     * 
     * @private
     * @param {Promise<any>} whenLoaded 
     * @returns {Promise<Prevision[]>} 
     * 
     * @memberOf CeturbApiService
     */
    private previsions( whenLoaded: Promise<any> ): Promise<Prevision[]> {
        return whenLoaded.then(( response: IHttpPromiseCallbackArg<any> ) => response.data )
            .then(( { horarioDoServidor, estimativas, pontoDeOrigemId }) => {

                const previsions = _.chain( estimativas ).sortBy( 'horarioNaOrigem' ).value();
                const itinerariesIds = previsions.map( e => e.itinerarioId );

                return this.listItinerariesByIds( itinerariesIds )
                    .then(( { itinerarios }) => {
                        const itinerariesMap = _.keyBy( itinerarios, 'id' );
                        return _.chain( previsions )
                            .map( e => this.createFullPrevision( e, itinerariesMap[ e.itinerarioId ], horarioDoServidor, pontoDeOrigemId ) )
                            .sortBy( 'previsaoEmMinutos' )
                            .value();
                    });
            });
    }

    /**
     * 
     * 
     * @private
     * @param {any} estimative 
     * @param {any} itinerary 
     * @param {any} horarioDoServidor 
     * @returns 
     * 
     * @memberOf CeturbApiService
     */
    private createFullPrevision( prevision, itinerary, horarioDoServidor, pontoDeOrigemId ): Prevision {
        const lastUpdateHour = moment( prevision.horarioDaTransmissao || 0 );
        const originHour = moment( prevision.horarioNaOrigem );
        const now = moment( horarioDoServidor );

        const previsaoEmMinutos = originHour.diff( now, 'minutes' );
        const previsao = previsaoEmMinutos === 0 ? 'Agora' : previsaoEmMinutos < 60 ? `${ previsaoEmMinutos } min` : `${ originHour.diff( now, 'hours' ) } h`;
        const reliability = lastUpdateHour.diff( now, 'minutes' );

        return {
            ...prevision,
            pontoDeOrigemId,
            bandeira: _.toLower( itinerary.bandeira ),
            complemento: _.toLower( itinerary.complemento ),
            descricaoLinha: _.toLower( itinerary.descricaoLinha ),
            identificadorLinha: itinerary.identificadorLinha,
            linhaId: itinerary.linhaId,
            previsaoEmMinutos,
            previsao,
            confiabilidade: reliability <= 7 ? 'verde'
                : reliability < 22 ? 'amarelo'
                    : reliability < 30 ? 'vermelho'
                        : 'cinza'
        };
    }

    /**
     * 
     * 
     * @param {number[]} ids
     * @returns {Promise<BusRoute>}
     * 
     * @memberOf CeturbApiService
     */
    private listItinerariesByIds( ids: number[] ): Promise<any> {
        return this.http.post( 'https://api.es.gov.br/ceturb/buscabus/svc/json/db/listarItinerarios', { listaIds: ids })
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data );
    }

    /**
     * 
     * 
     * @private
     * @param {BusStop[]} stops 
     * @returns 
     * 
     * @memberOf CeturbApiService
     */
    private formatBusStops( stops: BusStop[] ) {
        return stops.map( stop => {
            stop.isTerminal = /T[A-Z]{2,}/.test( stop.identificador );
            stop.isPonto = !stop.isTerminal;
            stop.tipo = stop.isTerminal ? 'terminal' : 'ponto';
            const [ logradouro, bairro, municipio ] = ( stop.descricao || 'Descrição não informada' ).split( ' - ' );
            return Object.assign( stop, {
                bairro: ( bairro || '' ).trim(),
                logradouro: ( logradouro || '' ).trim(),
                municipio: ( municipio || '' ).trim(),
                descricao: ( stop.descricao || '' ).trim()
            });
        });
    }
}
