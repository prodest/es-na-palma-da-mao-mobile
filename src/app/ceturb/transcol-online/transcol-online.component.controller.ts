import { IScope, IWindowService } from 'angular';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol-css';
import 'leaflet.markercluster';
import 'leaflet.markercluster-css';
import * as _ from 'lodash';

// import 'leaflet.markercluster-css2';
import { CeturbApiService, BusStop, Prevision } from '../shared/index';

// tslint:disable-next-line:variable-name
let BaseIcon = L.DivIcon.extend( {
    options: {
        iconSize: [ 32, 32 ],
        html: '<i class="fa fa-bus" aria-hidden="true"></i> <div class="azimute"></div>'
    }
});

interface BusLine {
    identificadorLinha: string;
    linhaId: number;
    pontoDeOrigemId: number;
}

export class TranscolOnlineController {

    public static $inject: string[] = [ '$scope', '$window', 'ceturbApiService' ];

    public map: L.Map;
    public stopsCluster: any = L.markerClusterGroup( {
        maxClusterRadius: 80,
        disableClusteringAtZoom: 14,
        spiderfyOnMaxZoom: false,
        showCoverageOnHover: false
    });
    public readonly zoom = {
        mapDefault: 13,
        thresholds: {
            mapMin: 8,
            mapMax: 18
        }
    };
    public allStops: { [ id: number ]: BusStop };
    public allStopMarkers: { [ id: number ]: L.Marker };
    public searchResults: BusStop[] = [];

    public isSummaryOpenned = false;
    public isDetailsOpenned = false;

    public selectedDestination: BusStop | undefined;
    public selectedOrigin: BusStop | undefined;
    public selectedLine: BusLine | undefined;
    public previsions: Prevision[] | undefined = [];
    public destinations: BusStop[] = [];


    /**
     * Creates an instance of TranscolOnlineController.
     * 
     * @param {IScope} $scope
     * @param {CeturbApiService} ceturbApiService
     * 
     * @memberOf TranscolOnlineController
     */
    constructor(
        private $scope: IScope,
        private $window: IWindowService,
        private ceturbApiService: CeturbApiService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }


    /**
     * Ativa o component
     *
     * @returns {void}
     */
    public async activate() {
        // ref: https://coderwall.com/p/ngisma/safe-apply-in-angular-js
        this.$scope.$safeApply = function ( fn ) {
            const phase = this.$root.$$phase;
            if ( phase === '$apply' || phase === '$digest' ) {
                if ( fn && ( typeof ( fn ) === 'function' ) ) {
                    fn();
                }
            } else {
                this.$apply( fn );
            }
        };

        this.map = this.createMap();
        const startBounds = [ -38.50708007812501, -17.14079039331664, -42.46215820312501, -23.725011735951796 ]; // grande vitória
        const stops = await this.ceturbApiService.getBusStopsByArea( startBounds );
        this.renderBusStops( stops );
    }

    /**
     * 
     * 
     * @private
     * @returns
     * 
     * @memberOf TranscolOnlineController
     */
    private createMap() {
        const map = L.map( 'map', {
            zoomControl: false,
            center: L.latLng( -20.315894186649725, -40.29565483331681 ),
            zoom: this.zoom.mapDefault,
            minZoom: this.zoom.thresholds.mapMin,
            maxZoom: this.zoom.thresholds.mapMax,
            maxBounds: L.latLngBounds( L.latLng( -18.713894456784224, -39.07836914062501 ), L.latLng( -22.009267904493782, -41.055908203125 ) )
        });

        const locateControl = L.control.locate( {
            position: 'topright',
            iconLoading: 'fa fa-circle-o-notch fa-spin',
            clickBehavior: { inView: 'setView', outOfView: 'setView' },
            flyTo: false,
            locateOptions: {
                maxZoom: 17
            },
            strings: {
                title: 'Onde estou?',
                popup: 'Você está num raio de {distance} {unit} deste ponto'
            }
        }).addTo( map );

        // request location update and set location
        locateControl.start();

        L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' )
            .addTo( map );

        map.on( 'moveend', () => {
            this.onMapMove();
            this.$scope.$safeApply(); // avisa ao angular sobre evento do leaflet
        });

        map.on( 'click', ( e ) => {
            this.unselectOrigin();
            this.$scope.$safeApply(); // avisa ao angular sobre evento do leaflet
        });
        return map;
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf TranscolOnlineController
     */
    private onMapMove() {
        this.logMapInfo();

        //  esconde origin quando clusters forem visíveis
        // if ( this.isInClusterView ) {
        //     this.reset();
        // }
    }

    /**
     * 
     * 
     * @readonly
     * @private
     * 
     * @memberOf TranscolOnlineController
     */
    private get isInClusterView() {
        return this.map.getZoom() < this.stopsCluster.options.disableClusteringAtZoom;
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf TranscolOnlineController
     */
    private logMapInfo() {
        console.log( 'zoom:', this.map.getZoom() );
        console.log( 'bounds:', this.map.getBounds() );
        console.log( 'center:', this.map.getCenter() );
    }

    /**
     * 
     * 
     * @private
     * @param {BusStop[]} stops 
     * 
     * @memberOf TranscolOnlineController
     */
    private renderBusStops( stops: BusStop[] ) {
        this.allStops = stops.reduce(( map, stop ) => { map[ stop.id ] = stop; return map; }, {});
        this.allStopMarkers = stops.reduce(( map, stop ) => { map[ stop.id ] = this.createMarkerTo( stop ); return map; }, {});

        this.stopsCluster.clearLayers();
        this.stopsCluster.addLayers( _.values( this.allStopMarkers ) );
        this.map.addLayer( this.stopsCluster );
        console.log( `adicionando camada com ${stops.length} paradas ao mapa` );
    }


    /**
       * 
       * 
       * @private
       * @param {BusStop} stop 
       * @returns 
       * 
       * @memberOf TranscolOnlineController
       */
    private createMarkerTo( stop: BusStop ) {
        const marker = L.marker( L.latLng( stop.latitude, stop.longitude ), { stop: stop } as L.MarkerOptions );
        marker.setIcon( this.createIcon( stop, 'default' ) );
        marker.setZIndexOffset( 100 );
        marker.on( 'click', e => {
            if ( this.isDetailsOpenned ) {
                this.closeDetails();
            }
            this.selectStop( stop );
            this.$scope.$safeApply();  // avisa ao angular sobre evento do leaflet
        });
        return marker;
    }



    public isShowingDestinations = false;
    public isShowingOriginPrevisions = false;
    public isShowingLinePrevisions = false;
    public isShowingRoutePrevisions = false;


    /**
        * 
        * 
        * @readonly
        * @type {boolean}
        * @memberOf TranscolOnlineController
        */
    public get isRouteSelected(): boolean {
        return !!this.selectedOrigin && !!this.selectedDestination;
    }

    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public onDestinationsButtonClick() {
        if ( this.isDetailsOpenned && this.isShowingDestinations ) {
            this.closeDetails();
        }
        else {
            this.showDestinations();
            this.openDetails();
        }
    }


    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public onPrevisionsButtonClick() {
        if ( this.isDetailsOpenned ) {
            if ( this.isShowingOriginPrevisions || this.isShowingRoutePrevisions ) {
                this.closeDetails();
            }
            else {
                this.showOriginPrevisions();
            }
        }
        else {
            if ( this.isRouteSelected ) {
                this.showRoutePrevisions();
            }
            else {
                this.showOriginPrevisions();
            }
            this.openDetails();
        }
    }

    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public closeDetails() {
        this.isDetailsOpenned = false;
    }


    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public openDetails() {
        this.isDetailsOpenned = true;
    }

    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public showDestinations() {
        this.navigateToDestinations();
    }


    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public navigateToDestinations( clearDestinations = false ) {
        if ( clearDestinations ) {
            this.destinations = [];
        }
        this.isShowingDestinations = true;
        this.isShowingOriginPrevisions = false;
        this.isShowingLinePrevisions = false;
        this.isShowingRoutePrevisions = false;
    }



    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public showOriginPrevisions(): Promise<Prevision[]> {
        this.previsions = undefined;
        this.navigateToOriginPrevisions();
        return this.getOriginPrevisions( this.selectedOrigin!.id );
    }

    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public navigateToOriginPrevisions( clearPrevisions = true ) {
        this.isShowingDestinations = false;
        this.isShowingOriginPrevisions = true;
        this.isShowingLinePrevisions = false;
        this.isShowingRoutePrevisions = false;
    }


    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public showRoutePrevisions(): Promise<Prevision[]> {
        this.previsions = undefined;
        this.navigateToRoutePrevisions();
        return this.getRoutePrevisions( this.selectedOrigin!.id, this.selectedDestination!.id );
    }

    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public navigateToRoutePrevisions( clearPrevisions = true ) {
        this.isShowingDestinations = false;
        this.isShowingOriginPrevisions = false;
        this.isShowingLinePrevisions = false;
        this.isShowingRoutePrevisions = true;
    }

    /**
     * 
     * 
     * @param {Prevision} prevision 
     * 
     * @memberOf TranscolOnlineController
     */
    public showLinePrevisions( line: BusLine ): Promise<Prevision[]> {
        this.previsions = undefined;
        this.selectedLine = line;
        this.navigateToLinePrevisions();
        return this.getLinePrevisions( line );
    }

    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public navigateToLinePrevisions( clearPrevisions = true ) {
        this.isShowingDestinations = false;
        this.isShowingOriginPrevisions = false;
        this.isShowingLinePrevisions = true;
        this.isShowingRoutePrevisions = false;
    }

    /**
     * 
     * 
     * @param {string} text 
     * 
     * @memberOf TranscolOnlineController
     */
    public searchAll( text: string ) {
        this.searchIn( _.values( this.allStops ), text );
    }

    /**
     * 
     * 
     * @param {string} text 
     * 
     * @memberOf TranscolOnlineController
     */
    public searchPossibleDestinations( text: string ) {
        this.searchIn( this.destinations, text );
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf TranscolOnlineController
     */
    public unselectOrigin() {
        _.values( this.allStops ).forEach( stop => this.setDefaultIcon( stop ) );
        this.closeAllScreens();
        this.unselectAll();
        this.clearSearchResults();
    }


    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public unselectDestination() {
        this.selectedDestination = undefined;
        this.selectOrigin( this.selectedOrigin! );
        this.navigateToDestinations();
    }


    /**
     * 
     * 
     * @private
     * @param {string} text 
     * @param {BusStop[]} dataSource 
     * @returns 
     * 
     * @memberOf TranscolOnlineController
     */
    private searchIn( dataSource: BusStop[], text: string ) {

        this.searchResults = [];

        if ( text.length <= 3 ) { return; }

        const regex = new RegExp( text, 'i' );

        this.searchResults = dataSource.filter(( stop: BusStop ) => stop.descricao.search( regex ) >= 0 || stop.identificador.search( regex ) >= 0 );
    }

    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public clearSearchResults() {
        this.searchResults = [];
    }

    /**
     * 
     * 
     * @param {BusStop} stop 
     * 
     * @memberOf TranscolOnlineController
     */
    public selectStop( stop: BusStop ) {

        this.clearSearchResults();

        // se nenhuma origem está selecionada, seleciona como origem
        if ( !this.selectedOrigin ) {
            this.selectOrigin( stop );
        }

        else if ( this.isSelectedOrigin( stop ) ) {
            this.unselectOrigin();
        }

        else if ( this.isSelectedDestination( stop ) ) {
            this.unselectDestination();
        }

        /*
         1-Se existe origem selecionada
         2-Se não é a origem selecionada
         3-Não possui destino selecionado
         4-Não está na lista de destinos possíveis
        
         Então seleciona como origem
        */
        else if ( !this.isSelectedOrigin( stop ) && !this.isPossibleDestination( stop ) ) {
            this.selectOrigin( stop );
        }
        /*
         1-Se existe origem selecionada
         2-Se não é a origem selecionada
         3-Não possui destino selecionado
         4-Está na lista de destinos possíveis
        
         Então seleciona como destino
        */
        else if ( !this.isSelectedOrigin( stop ) && this.isPossibleDestination( stop ) ) {
            this.selectDestination( stop );
        }
        else if ( !this.isSelectedOrigin( stop ) && !this.isSelectedDestination( stop ) ) {
            this.selectOrigin( stop );
        }
    }

    /**
     * 
     * 
     * @private
     * @param {BusStop} origin 
     * 
     * @memberOf TranscolOnlineController
     */
    private selectOrigin( origin: BusStop ) {
        this.unselectAll();

        this.selectedOrigin = origin;

        this.isSummaryOpenned = true;

        // set all other stops icons as secondary
        _.values( this.allStops )
            .filter( stop => !this.isSelectedOrigin( stop ) )
            .forEach( stop => this.setSecundaryIcon( stop ) );

        this.setOriginIcon( origin );

        // navigate to selected origin        
        this.panToStop( origin );

        // refresh estimatives
        this.getOriginPrevisions( origin.id );
        this.updateDestinations( origin );
    }

    /**
     * 
     * 
     * @param {BusStop} destination 
     * 
     * @memberOf TranscolOnlineController
     */
    public selectDestination( destination: BusStop ) {
        this.selectedDestination = destination;
        // set all other stops icons as secondary
        _.values( this.allStops )
            .filter( stop => !this.isSelectedOrigin( stop ) )
            .forEach( stop => this.setSecundaryIcon( stop ) );

            // refresh estimatives
        this.showRoutePrevisions();
        
        this.getRouteDestinations( this.selectedOrigin!.id, this.selectedDestination!.id )
            .then( stops => this.plotDestinationMarkers( stops ) );

        // set destination icon
        this.setDestinationIcon( destination );

        // navigate to selected destination
        this.panToStop( destination );

        
    }


    /**
     * 
     * 
     * @param {BusStop} origin 
     * 
     * @memberOf TranscolOnlineController
     */
    public async updateDestinations( origin: BusStop ) {
        const timer = this.$window.setTimeout(() => this.setSpinIcon( origin ), 800 );

        try {
            const destinations = await this.getOriginDestinations( origin.id );
            this.plotDestinationMarkers( destinations );
            this.setOriginIcon( origin );
        }
        finally {
            clearInterval( timer );
        }
    }

    /**
     * 
     * 
     * @param {number} originId 
     * @returns {Promise<BusStop[]>}
     * 
     * @memberOf TranscolOnlineController
     */
    public async getOriginDestinations( originId: number ): Promise<BusStop[]> {
        const ids = await this.ceturbApiService.getBusStopsIdsByOrigin( originId );
        this.destinations = this.loadStopsFromMemory( ids );
        return this.destinations;
    }


    /**
    * 
    * 
    * @param {number} originId 
    * @param {number} destinationId 
    * @returns {Promise<Prevision[]>} 
    * 
    * @memberOf TranscolOnlineController
    */
    public async getRouteDestinations( originId: number, destinationId: number ): Promise<BusStop[]> {
        const ids = await this.ceturbApiService.getBusStopsIdsByRoute( originId, destinationId );
        this.destinations = this.loadStopsFromMemory( ids );
        return this.destinations;
    }

    /**
     * 
     * 
     * @param {number} originId 
     * @returns {Promise<Prevision[]>}
     * 
     * @memberOf TranscolOnlineController
     */
    public async getOriginPrevisions( originId: number ): Promise<Prevision[]> {
        this.previsions = await this.ceturbApiService.getPrevisionsByOrigin( originId );
        return this.previsions;
    }


    /**
     * 
     * 
     * @param {number} originId 
     * @param {number} destinationId 
     * @returns {Promise<Prevision[]>} 
     * 
     * @memberOf TranscolOnlineController
     */
    public async getRoutePrevisions( originId: number, destinationId: number ): Promise<Prevision[]> {
        this.previsions = await this.ceturbApiService.getPrevisionsByOriginAndDestination( originId, destinationId );
        console.log( this.previsions.length );

        return this.previsions;
    }

    /**
     * 
     * 
     * @param {number} originId 
     * @param {number} lineId 
     * @returns {Promise<Prevision[]>}
     * 
     * @memberOf TranscolOnlineController
     */
    public async getLinePrevisions( line: BusLine ): Promise<Prevision[]> {
        this.previsions = await this.ceturbApiService.getPrevisionsByOriginAndLine( line.pontoDeOrigemId, line.linhaId );
        return this.previsions;
    }

    /**
     * 
     * 
     * @private
     * @param {number} latitude 
     * @param {number} longitude 
     * 
     * @memberOf TranscolOnlineController
     */
    public panToStop( stop: BusStop ) {
        const newZoom = this.map.getZoom() < this.stopsCluster.options.disableClusteringAtZoom
            ? this.stopsCluster.options.disableClusteringAtZoom
            : this.map.getZoom();
        this.map.setView( new L.LatLng( stop.latitude, stop.longitude ), newZoom , { animate: true, duration: 0.5 });
    }

    /**
     * 
     * 
     * @private
     * @param {BusStop[]} destineStops 
     * 
     * @memberOf TranscolOnlineController
     */
    private plotDestinationMarkers( destineStops: BusStop[] = [] ) {
        destineStops
            .filter( stop => !this.isSelectedOrigin( stop ) )
            .forEach( stop => this.setAvailableDestinationIcon( stop ) );
    }

    /**
     * 
     * 
     * @param {number[]} ids 
     * @returns 
     * 
     * @memberOf TranscolOnlineController
     */
    private loadStopsFromMemory( ids: number[] ) {
        return ids.map( id => this.allStops[ id ] && this.allStops[ id ] )
            .filter( d => !!d );
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * @returns {boolean} 
     * 
     * @memberOf TranscolOnlineController
     */
    private isSelectedOrigin( stop: BusStop ): boolean {
        return !!this.selectedOrigin && this.selectedOrigin.id === stop.id;
    }


    /**
     * 
     * 
     * @private
     * @param {BusStop} stop 
     * @returns {boolean} 
     * 
     * @memberOf TranscolOnlineController
     */
    private isSelectedDestination( stop: BusStop ): boolean {
        return !!this.selectedDestination && this.selectedDestination.id === stop.id;
    }

    /**
     * 
     * 
     * @private
     * @param {BusStop} stop 
     * @returns {boolean} 
     * 
     * @memberOf TranscolOnlineController
     */
    private isPossibleDestination( stop: BusStop ): boolean {
        return !!this.destinations.length && !!this.destinations.find( s => s.id === stop.id );
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * 
     * @memberOf TranscolOnlineController
     */
    private setOriginIcon( stop: BusStop ) {
        this.setIcon( stop, 'origin', 2000 );
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * 
     * @memberOf TranscolOnlineController
     */
    private setDestinationIcon( stop: BusStop ) {
        this.setIcon( stop, 'destination', 1000 );
    }


    /**
     * 
     * 
     * @private
     * @param {BusStop} stop 
     * 
     * @memberOf TranscolOnlineController
     */
    private setAvailableDestinationIcon( stop: BusStop ) {
        this.setIcon( stop, 'available-destination', 1000 );
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * 
     * @memberOf TranscolOnlineController
     */
    private setDefaultIcon( stop: BusStop ) {
        this.setIcon( stop, 'default', 100 );
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * 
     * @memberOf TranscolOnlineController
     */
    private setSecundaryIcon( stop: BusStop ) {
        this.setIcon( stop, 'secondary', 100 );
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * @param {any} options 
     * 
     * @memberOf TranscolOnlineController
     */
    private setIcon( stop: BusStop, type: 'default' | 'secondary' | 'origin' | 'destination' | 'available-destination', zIndexOffset: number ) {
        if ( !stop ) { return; }
        const marker = this.allStopMarkers[ stop.id ];
        marker.setIcon( this.createIcon( stop, type ) );
        marker.setZIndexOffset( zIndexOffset );
    }


    /**
     * 
     * 
     * @private
     * @param {BusStop} stop 
     * @param {('default' | 'secondary' | 'origin' | 'destination')} type 
     * @returns 
     * 
     * @memberOf TranscolOnlineController
     */
    private createIcon( stop: BusStop, type: 'default' | 'secondary' | 'origin' | 'destination' | 'available-destination' ) {
        return new BaseIcon( { className: `marker dir-${stop.direcao} marker-${type} marker-${stop.tipo}` });
    }


    /**
   * 
   * 
   * @private
   * @param {L.Marker} marker 
   * 
   * @memberOf TranscolOnlineController
   */
    private setSpinIcon( stop: BusStop ) {
        const marker = this.allStopMarkers[ stop.id ];
        marker.setIcon( new BaseIcon( { className: 'marker marker-origin marker-spin', html: '<i class="fa fa-circle-o-notch fa-spin" aria-hidden="true"></i>' }) );
        marker.setZIndexOffset( 2000 );
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf TranscolOnlineController
     */
    private unselectAll() {
        this.selectedOrigin = this.selectedLine = this.selectedDestination = undefined;
        this.previsions = this.destinations = [];
    }


    /**
     * 
     * 
     * @private
     * 
     * @memberOf TranscolOnlineController
     */
    private closeAllScreens() {
        this.isDetailsOpenned = false;
        this.isSummaryOpenned = false;
    }
}

