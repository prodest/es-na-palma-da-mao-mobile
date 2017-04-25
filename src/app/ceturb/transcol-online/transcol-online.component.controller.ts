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
}

export class TranscolOnlineController {

    public static $inject: string[] = [ '$scope', '$window', 'ceturbApiService' ];

    public map: L.Map;
    public stopsCluster: any = L.markerClusterGroup( {
        maxClusterRadius: 80,
        disableClusteringAtZoom: 15,
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

    public showOriginSummary = false;
    public showOriginDetails = false;
    public showOriginDestinies = false;
    public showPrevisionsByOrigin = false;

    public selectedOrigin: BusStop | undefined;
    public selectedLine: BusLine | undefined;
    public previsionsByOrigin: Prevision[] = [];
    public previsionsByLine: Prevision[] = [];
    public destines: BusStop[] = [];


    /**
     * Creates an instance of TranscolOnlineController.
     * 
     * @param {IScope} $scope
     * @param {CeturbApiService} ceturbApiService
     * 
     * @memberOf TranscolOnlineController
     */
    constructor( private $scope: IScope, private $window: IWindowService, private ceturbApiService: CeturbApiService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }


    /**
     * Ativa o component
     *
     * @returns {void}
     */
    public activate() {
        this.map = this.createMap();
        const startBounds = [ -38.50708007812501, -17.14079039331664, -42.46215820312501, -23.725011735951796 ]; // grande vitória
        this.ceturbApiService
            .getBusStopsByArea( startBounds )
            .then( stops => this.renderBusStops( stops ) );
    }

    /**
     * 
     * 
     * @param {Prevision} prevision 
     * 
     * @memberOf TranscolOnlineController
     */
    public showLinePrevisions( prevision: Prevision ) {
        this.previsionsByLine = [];
        this.selectedLine = { identificadorLinha: prevision.identificadorLinha, linhaId: prevision.linhaId };
        this.getLinePrevisions( prevision.pontoDeOrigemId, prevision.linhaId )
            .then(() => this.$scope.$apply() );
    }

    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public togglePrevisions() {
        this.showPrevisionsByOrigin = this.selectedLine ? true : !this.showPrevisionsByOrigin;
        this.showOriginDetails = this.showPrevisionsByOrigin;
        this.showOriginDestinies = false;
        this.selectedLine = undefined;
        this.previsionsByLine = [];

        if ( this.showPrevisionsByOrigin ) {
            this.getOriginPrevisions( this.selectedOrigin!.id );
        }
    }


    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public toggleDestinies() {
        this.showOriginDestinies = this.selectedLine ? true : !this.showOriginDestinies;
        this.showOriginDetails = this.showOriginDestinies;
        this.showPrevisionsByOrigin = false;
        this.selectedLine = undefined;
        this.previsionsByLine = [];
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
            flyTo: true,
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

        L.tileLayer( 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWx2YXJvbGxtZW5lemVzIiwiYSI6ImNpejc5cW42YTAwMnQzMXFvbzl0d3RlNDMifQ.dI1h507huh6XDABHZ9FBoQ' )
            .addTo( map );

        map.on( 'moveend', () => this.onMapMove() );
        map.on( 'click', ( e ) => this.unSelectOriginOnMap() );
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
        if ( this.isInClusterView ) { 
            this.unSelectOriginOnMap();
        }
        this.$scope.$apply();
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
        console.log( `adicionando camada com ${ stops.length } paradas ao mapa` );
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
        marker.on( 'click', e => this.onMarkerClick( stop ) );
        return marker;
    }


    /**
     * 
     * 
     * @private
     * @param {StopInfo} stop 
     * 
     * @memberOf TranscolOnlineController
     */
    private onMarkerClick( stop: BusStop ) {
        if ( !this.isOrigin( stop ) ) {
            this.selectOrigin( stop );
            this.updateDestines( stop );
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
        this.unSelectOrigin();

        this.selectedOrigin = origin;
        
        this.showOriginSummary = true;

        // set all other stops icons as secondary
        _.values( this.allStops )
            .filter( stop => !this.isOrigin( stop ) )
            .forEach( stop => this.setSecundaryIcon( stop ) );

        this.setOriginIcon( origin );

        // navigate to selected origin        
        this.panTo( origin.latitude, origin.longitude );

        // refresh estimatives
        this.getOriginPrevisions( origin.id );

        // this.$scope.$apply();
    }


    /**
     * 
     * 
     * @param {BusStop} origin 
     * 
     * @memberOf TranscolOnlineController
     */
    public updateDestines( origin: BusStop ) {
        const timer = this.$window.setTimeout(() => this.setSpinIcon( origin ), 800 );
        this.getDestines( origin.id )
            .then( destines => {
                this.plotDestinyMarkers( destines );
                this.setOriginIcon( origin );
            } )
            .catch( () => clearInterval( timer) )
            .then(() => clearInterval( timer ) );
    }

    /**
     * 
     * 
     * @param {number} originId 
     * @returns {Promise<BusStop[]>}
     * 
     * @memberOf TranscolOnlineController
     */
    public getDestines( originId: number ): Promise<BusStop[]> {
        return this.ceturbApiService
            .getBusStopsIdsByOrigin( originId )
            .then( ids => this.destines = this.loadStopsFromMemory( ids ) );
    }


    /**
     * 
     * 
     * @param {number} originId 
     * @returns {Promise<Prevision[]>}
     * 
     * @memberOf TranscolOnlineController
     */
    public getOriginPrevisions( originId: number ): Promise<Prevision[] > {
        return this.ceturbApiService
            .getPrevisionsByOrigin( originId )
            .then(( previsions: Prevision[] ) => {
                this.previsionsByOrigin = previsions;
                this.$scope.$apply();
                return this.previsionsByOrigin;
            });
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
    public getLinePrevisions( originId: number, lineId: number ): Promise<Prevision[]> {
        return this.ceturbApiService
            .getPrevisionsByOriginAndLine( originId, lineId )
            .then(( previsions: Prevision[] ) => {
                this.previsionsByLine = previsions;
                this.$scope.$apply();
                return this.previsionsByLine;
            } );
    }

    /**
     * 
     * 
     * @private
     * @param {BusStop[]} destineStops 
     * 
     * @memberOf TranscolOnlineController
     */
    private plotDestinyMarkers( destineStops: BusStop[] = [] ) {
        destineStops
            .filter( stop => !this.isOrigin( stop ) )
            .forEach( stop => this.setDestinyIcon( stop ) );
        this.$scope.$apply();
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
    private isOrigin( stop: BusStop ): boolean {
        return !!this.selectedOrigin && this.selectedOrigin.id === stop.id;
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
    private setDestinyIcon( stop: BusStop ) {
        this.setIcon( stop, 'destiny', 1000 );
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
    public setSecundaryIcon( stop: BusStop ) {
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
    private setIcon( stop: BusStop, type: 'default' | 'secondary' | 'origin' | 'destiny', zIndexOffset: number ) {
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
     * @param {('default' | 'secondary' | 'origin' | 'destiny')} type 
     * @returns 
     * 
     * @memberOf TranscolOnlineController
     */
    private createIcon( stop: BusStop, type: 'default' | 'secondary' | 'origin' | 'destiny' ) {
        return new BaseIcon( { className: `marker dir-${ stop.direcao } marker-${ type } marker-${ stop.tipo }` });
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
     * @param {number} latitude 
     * @param {number} longitude 
     * 
     * @memberOf TranscolOnlineController
     */
    private panTo( latitude: number, longitude: number ) {
        this.map.panTo( new L.LatLng( latitude, longitude ), { animate: true, duration: 0.5 });
    }


    /**
     * 
     * 
     * @private
     * 
     * @memberOf TranscolOnlineController
     */
    private unSelectOriginOnMap() {
        _.values( this.allStops ).forEach( stop => this.setDefaultIcon( stop ) );
        this.closeAllWindows();
        this.$window.setTimeout(() => {
            this.selectedOrigin = this.selectedLine = undefined;
            this.previsionsByOrigin = this.previsionsByLine = this.destines = [];
        }, 500 );
        this.$scope.$apply();
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf TranscolOnlineController
     */
    private unSelectOrigin() {
        this.selectedOrigin = this.selectedLine = undefined;
        this.previsionsByOrigin = this.previsionsByLine = this.destines = [];
    }

    private closeAllWindows() {
        this.showOriginDetails = false;
        this.showOriginDestinies = false;
        this.showPrevisionsByOrigin = false;
        this.showOriginSummary = false;
    }
}

