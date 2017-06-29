import * as L from 'leaflet';
import { IComponentController } from 'angular';
import { Geolocation } from 'ionic-native';

export class GeolocationController implements IComponentController {

    public static $inject: string[] = [ '$scope' ];

    public active: boolean;
    public currentPosition: L.LatLng;
    public circle: L.Circle;
    public marker: L.CircleMarker;
    public layers: L.LayerGroup;

    public refreshLocation: Boolean;

    public onLocationChanged: ( layerGroup: { layerGroup: L.LayerGroup, center: L.LatLng } ) => void;

    private circleStyle = {
        color: '#136AED',
        fillColor: '#136AEC',
        fillOpacity: 0.15,
        weight: 2,
        opacity: 0.5
    };

    private markerStyle = {
        color: '#136AEC',
        fillColor: '#2A93EE',
        fillOpacity: 0.7,
        weight: 2,
        opacity: 0.9,
        radius: 5
    };

    /**
     * Creates an instance of ErrorMessageController.
     * 
     */
    constructor() { }

    public $onInit (): void {
        this.refreshLocation = this.refreshLocation || false;
    };

    public $onChanges ( changes ) {
        if ( this.refreshLocation ) {
            this.updateLocation();
            this.refreshLocation = false;
        }
    };

    private getLocation () {
        this.active = true;
        return Geolocation.getCurrentPosition( { timeout: 10000 } )
            .then(( resp ) => {
                this.currentPosition = L.latLng( resp.coords.latitude, resp.coords.longitude );
                const radius = resp.coords.accuracy || 5;

                if ( !this.circle ) {
                    this.circle = L.circle( this.currentPosition, radius, this.circleStyle );
                } else {
                    this.circle.setLatLng( this.currentPosition ).setRadius( radius ).setStyle( this.circleStyle );
                }

                if ( !this.marker ) {
                    this.marker = new L.CircleMarker( this.currentPosition, this.markerStyle );
                } else {
                    this.marker.setLatLng( this.currentPosition );
                    // If the markerClass can be updated with setStyle, update it.
                    if ( this.marker.setStyle ) {
                        this.marker.setStyle( this.markerStyle );
                    }
                }

                this.layers = new L.LayerGroup( [ this.marker, this.circle ] );
                this.active = false;
            } );
    }

    /**
     * Indica se é um server error (500-599)
     * 
     * @readonly
     * @type {boolean}
     */
    public updateLocation (): void {
        this.getLocation()
            .then(() => this.onLocationChanged( { layerGroup: this.layers, center: this.currentPosition } ) )
            .catch(( error ) => {
                this.active = false;
                console.log( 'Error getting location', error );
            } );
    }
}