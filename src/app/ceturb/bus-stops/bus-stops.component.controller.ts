import { IScope } from 'angular';
import * as L from 'leaflet';
import 'leaflet.locatecontrol';
import 'leaflet.locatecontrol-css';
import 'leaflet.markercluster';
import 'leaflet.markercluster-css';
// import 'leaflet.markercluster-css2';
import { CeturbApiService } from '../shared/index';



let BaseIcon = L.DivIcon.extend( {
    options: {
        iconSize: [ 37, 37 ],
        html: '<i class="fa fa-bus" aria-hidden="true"></i>'
    }
});

export class BusStopsController {

    public static $inject: string[] = [ '$scope', 'ceturbApiService' ];

    public map: L.Map;
    public stops: any = L.markerClusterGroup( {
        maxClusterRadius: 80,
        disableClusteringAtZoom: 16,
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

    /**
     * Creates an instance of BusStopsController.
     * 
     * @param {IScope} $scope
     * @param {CeturbApiService} ceturbApiService
     * 
     * @memberOf BusStopsController
     */
    constructor( private $scope: IScope,
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
        this.renderVisibleBusStops();
    }

    /**
     * 
     * 
     * @private
     * @returns
     * 
     * @memberOf BusStopsController
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

        return map;
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf BusStopsController
     */
    private onMapMove() {
        this.logMapInfo();
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf BusStopsController
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
     * 
     * @memberOf BusStopsController
     */
    private renderVisibleBusStops() {
        this.ceturbApiService.getBusStopsByArea( [ -38.50708007812501, -17.14079039331664, -42.46215820312501, -23.725011735951796 ] )
            .then( ids => this.ceturbApiService.listBusStopsByIds( ids ) )
            .then( stops => {

                const markers = stops.map( stop => L.marker( L.latLng( stop.latitude, stop.longitude ), { icon: new BaseIcon( { className: 'user-icon' }) }) );

                this.stops.clearLayers();
                this.stops.addLayers( markers );
                this.map.addLayer( this.stops );
                console.log( `adicionando camada com ${markers.length} paradas ao mapa` );
            });
    }
}

