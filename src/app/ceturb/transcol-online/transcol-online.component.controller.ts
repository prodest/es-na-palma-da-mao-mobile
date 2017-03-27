import { IScope, IWindowService } from 'angular';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol-css';
import 'leaflet.markercluster';
import 'leaflet.markercluster-css';
// import 'leaflet.markercluster-css2';
import { CeturbApiService, BusStop } from '../shared/index';

// tslint:disable-next-line:variable-name
let BaseIcon = L.DivIcon.extend( {
    options: {
        iconSize: [ 32, 32 ],
        html: '<i class="fa fa-bus" aria-hidden="true"></i> <div class="azimute"></div>'
    }
});


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
    public destinesMarkers: L.Marker[] = [];
    public allStopsMarkers: L.Marker[] = [];
    public originMarker: L.Marker | undefined;
    public originStop: BusStop | undefined;
    public showOriginInfo = false;
    public showOriginDetails = false;
    /**
     * Creates an instance of TranscolOnlineController.
     * 
     * @param {IScope} $scope
     * @param {CeturbApiService} ceturbApiService
     * 
     * @memberOf TranscolOnlineController
     */
    constructor( private $scope: IScope,
        private $window: IWindowService,
        private ceturbApiService: CeturbApiService ) {
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
        map.on( 'click', ( e ) => this.unSelectOrigin() );
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
        this.showOriginInfo = !!this.originMarker && this.isInClusterView;
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
        return this.map.getZoom() >= this.stopsCluster.options.disableClusteringAtZoom;
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
        this.allStopsMarkers = stops.map( stop => this.createMarkerFrom( stop ) );
        this.stopsCluster.clearLayers();
        this.stopsCluster.addLayers( this.allStopsMarkers );
        this.map.addLayer( this.stopsCluster );
        console.log( `adicionando camada com ${ this.allStopsMarkers.length } paradas ao mapa` );
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
    private createMarkerFrom( stop: BusStop ) {
        const marker = L.marker( L.latLng( stop.latitude, stop.longitude ),  { stop: stop } as L.MarkerOptions );
        marker.on( 'click', e => this.selectOrigin( e.target ) );
        this.setDefaultIcon( marker );
        return marker;
    }

    /**
     * 
     * 
     * @private
     * @param {BusStop} origin 
     * 
     * @memberOf TranscolOnlineController
     */
    private selectOrigin( marker: L.Marker ) {
   
        if ( this.isOrigin( marker ) ) { return; }

        this.originStop = this.unwrap( marker );
        this.originMarker = marker;
        this.showOriginInfo = true;

        // navigate to selected origin        
        this.panTo( this.originStop.latitude, this.originStop.longitude );

        this.allStopsMarkers.forEach( m => this.setSecundaryIcon( m ) );
        this.setOriginIcon( this.originMarker );
        const timer = this.$window.setTimeout(() => this.setSpinStyle( this.originMarker! ), 800 );

        this.ceturbApiService.getBusStopsByOrigin( this.originStop.id )
            .then( destineStops => {
                clearInterval( timer );
                this.setOriginIcon( this.originMarker! );
                const destinesIds = destineStops.map( s => s.id );
                this.destinesMarkers = this.allStopsMarkers
                    .filter(( m: any ) => destinesIds.indexOf( m.options.stop.id ) !== -1 ) // apenas os retornados na consutla de destinos
                    .filter(( m: any ) => m.options.stop.id !== this.originStop!.id );  // exclui a origem 
            
                this.destinesMarkers.forEach( m => this.setDestinyIcon( m ) );
                this.$scope.$apply();
            });
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
    private isOrigin( marker: L.Marker ): boolean { 
        return !!this.originStop && this.originStop.id === this.unwrap( marker ).id;
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * 
     * @memberOf TranscolOnlineController
     */
    private setOriginIcon( marker: L.Marker ) {
        this.setMarkerIcon( marker, { style: 'origin', zIndexOffset: 2000 });
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * 
     * @memberOf TranscolOnlineController
     */
    private setDestinyIcon( marker: L.Marker ) {
        this.setMarkerIcon( marker, { style: 'destiny', zIndexOffset: 1000 });
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * 
     * @memberOf TranscolOnlineController
     */
    private setDefaultIcon( marker: L.Marker ) {
        this.setMarkerIcon( marker, { style: 'default', zIndexOffset: 100 });
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * 
     * @memberOf TranscolOnlineController
     */
    private setSecundaryIcon( marker: L.Marker ) {
        this.setMarkerIcon( marker, { style: 'secondary', zIndexOffset: 100 });
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
    private setMarkerIcon( marker: L.Marker, iconOptions: { style: 'default' | 'secondary' | 'origin' | 'destiny', zIndexOffset: number } ) {
        const stop = this.unwrap( marker );
        const className = `marker dir-${ stop.direcao } marker-${ iconOptions.style } marker-${ stop.tipo }`;
        marker.setIcon( new BaseIcon( { className: className }) );
        marker.setZIndexOffset( iconOptions.zIndexOffset );
    }    

    /**
   * 
   * 
   * @private
   * @param {L.Marker} marker 
   * 
   * @memberOf TranscolOnlineController
   */
    private setSpinStyle( marker: L.Marker ) {
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
    private unSelectOrigin() {
        this.showOriginInfo = false;
        this.showOriginDetails = false;
        this.allStopsMarkers.forEach( m => this.setDefaultIcon( m ) );
        this.$window.setTimeout(() => {
            this.originMarker = this.originStop = undefined;
            this.destinesMarkers = [];
        }, 500 );
        this.$scope.$apply();
    }

    /**
     * 
     * 
     * @private
     * @param {L.Marker} marker 
     * @returns {BusStop} 
     * 
     * @memberOf TranscolOnlineController
     */
    private unwrap( marker: L.Marker ): BusStop {
        return marker.options[ 'stop' ] as BusStop;
    }
}

