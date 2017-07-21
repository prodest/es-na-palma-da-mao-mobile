import { IRootScopeService, IScope, IWindowService, IIntervalService, IRequestShortcutConfig } from 'angular';
import './favorites/favorites-modal.component.scss';
import favoritesModalTemplate = require( './favorites/favorites-modal.component.html' );
import { FavoritesModalController } from './favorites/favorites-modal.component.controller';
import { AuthenticationService } from '../../security/shared/index';
import { AuthNeededController, authNeededTemplate } from '../../layout/auth-needed/index';
import { TranscolOnlineStorage, FavoriteLocation, BusStop, Prevision, TranscolOnlineApiService, sortByFavorite } from './shared/index';
import { TransitionService } from '../../shared/shared.module';
import * as L from 'leaflet';
import * as _ from 'lodash';
import 'leaflet.markercluster';
import 'leaflet.markercluster-css';

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

const SEARCH_MIN_LENGTH = 3;
const REFRESH_INTERVAL = 30000;
const TRANSPARENT_REQUEST_CONFIG = { headers: { 'Transparent': true } };

export class TranscolOnlineController {

    public static $inject: string[] = [
        '$rootScope',
        '$scope',
        '$window',
        '$mdDialog',
        '$interval',
        'transcolOnlineStorage',
        'authenticationService',
        'transcolOnlineApiService',
        'transitionService'
    ];

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
    public searchResults: BusStop[] = [];
    public searching: boolean = false;
    public searchId: number = 0;
    public isSummaryOpenned = false;
    public isDetailsOpenned = false;
    public showLabels = false;
    public selectedDestination: BusStop | undefined;
    public selectedOrigin: BusStop | undefined;
    public selectedLine: BusLine | undefined;
    public previsions: Prevision[] | undefined = [];
    public destinations: BusStop[] = [];
    public favorites: { stop: BusStop, type: FavoriteLocation }[] = [];

    public circle: any;
    public marker: any;
    public locationLayer: L.LayerGroup;
    public refreshLocation: boolean = false;
    public autoRefreshTimer: any; // IPromise<any>

    /**
     * Creates an instance of TranscolOnlineController.
     * @param {IScope} $scope 
     * @param {IWindowService} $window 
     * @param {CeturbApiService} ceturbApiService 
     * 
     * @memberOf TranscolOnlineController
     */
    constructor(
        private $rootScope: IRootScopeService,
        private $scope: IScope,
        private $window: IWindowService,
        private $mdDialog: angular.material.IDialogService,
        private $interval: IIntervalService,
        private storage: TranscolOnlineStorage,
        private authenticationService: AuthenticationService,
        private api: TranscolOnlineApiService,
        private transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
        this.$scope.$on( '$ionicView.beforeEnter', () => {
            this.refreshLocation = true;
            this.startAutoRefreshTimer();
        });
        this.$scope.$on( '$ionicView.leave', () => this.stopAutoRefreshTimer() /* para o timer de auto refresh de previsões */ );
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
        const stops = await this.api.getBusStopsByArea( startBounds );

        this.renderBusStops( stops );
        this.syncFavorites( false );
    }


    /**
     * 
     * 
     * @private
     * @memberof TranscolOnlineController
     */
    private startAutoRefreshTimer() {

        this.stopAutoRefreshTimer();

        this.autoRefreshTimer = this.$interval(() => {

            if ( this.isDetailsOpenned ) {
                if ( this.selectedOrigin && this.selectedDestination ) {
                    // console.log( 'buscando previsões para rota: ', this.selectedOrigin.identificador, ' => ', this.selectedDestination.identificador );
                    this.getRoutePrevisions( this.selectedOrigin.id, this.selectedDestination.id, TRANSPARENT_REQUEST_CONFIG );
                } else if ( this.selectedLine ) {
                    // console.log( 'buscando previsões para a linha: ', this.selectedLine.identificadorLinha, ' na origem: ', this.selectedLine.pontoDeOrigemId );
                    this.getLinePrevisions( this.selectedLine, TRANSPARENT_REQUEST_CONFIG );
                }
                else if ( this.selectedOrigin ) {
                    // console.log( 'buscando previsões na origem: ', this.selectedOrigin.identificador );
                    this.getOriginPrevisions( this.selectedOrigin.id, TRANSPARENT_REQUEST_CONFIG );
                }
            }
        }, REFRESH_INTERVAL );
    }

    /**
     * 
     * 
     * @memberof TranscolOnlineController
     */
    public stopAutoRefreshTimer() {
        if ( this.autoRefreshTimer ) {
            this.$interval.cancel( this.autoRefreshTimer );
        }
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberof TranscolOnlineController
     */
    private updateFavoritesFromLocalStorage() {
        this.favorites = _.chunk( this.storage.favoriteStops.items.sort( sortByFavorite ).map( i => <any>{
            stop: this.allStops[ i.stop ],
            type: i.type
        }), 3 );
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
            tap: false, // !important
            zoomControl: false,
            center: L.latLng( -20.315894186649725, -40.29565483331681 ),
            zoom: this.zoom.mapDefault,
            minZoom: this.zoom.thresholds.mapMin,
            maxZoom: this.zoom.thresholds.mapMax,
            maxBounds: L.latLngBounds( L.latLng( -18.713894456784224, -39.07836914062501 ), L.latLng( -22.009267904493782, -41.055908203125 ) )
        });

        L.tileLayer( `http://mapas.geocontrol.com.br/image-cache/imagem/xyz/OpenStreetMaps?x={x}&y={y}&zoom={z}&projeto=GVBUS-BUSCABUS` )
            .addTo( map );

        map.on( 'moveend', () => {
            this.onMapMove();
            this.$scope.$safeApply(); // avisa ao angular sobre evento do leaflet
        });

        map.on( 'click', ( e ) => {
            this.clearMapSelection();
            this.$scope.$safeApply(); // avisa ao angular sobre evento do leaflet
        });
        return map;
    }

    public setLocationLayer( locationLayer: L.LayerGroup, center: L.LatLng ) {
        this.refreshLocation = false;
        if ( this.locationLayer ) {
            this.locationLayer.clearLayers();
        }
        this.locationLayer = locationLayer;
        this.locationLayer.addTo( this.map );
        this.panTo( center );
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
        this.selectedLine = undefined;
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
        this.selectedLine = undefined;
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
     * @param {string} text 
     * @param {(number | undefined)} [originId=undefined] 
     * 
     * @memberof TranscolOnlineController
     */
    public async searchBustStops( text: string, originId: number | undefined = undefined ) {

        if ( text.trim().length < SEARCH_MIN_LENGTH ) { return; }

        try {
            const currentSearch = ++this.searchId;
            this.searching = true;
            let stopsIds = await this.api.searchBusStopsIds( text, originId );

            // se tiver origem selecionada mantem somente possíveis destinos            
            if ( this.selectedOrigin ) {
                stopsIds = stopsIds.filter( s => this.isPossibleDestination( s ) );
            }
            // sempre exibe o resultado mais recente e ignora anteriores
            if ( currentSearch === this.searchId ) {
                this.searchResults = stopsIds.map( id => this.allStops[ id ] );
            }
        } finally {
            this.searching = false;
        }
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
        else if ( !this.isSelectedOrigin( stop ) && !this.isPossibleDestination( stop.id ) ) {
            this.selectOrigin( stop );
        }
        /*
         1-Se existe origem selecionada
         2-Se não é a origem selecionada
         3-Não possui destino selecionado
         4-Está na lista de destinos possíveis
        
         Então seleciona como destino
        */
        else if ( !this.isSelectedOrigin( stop ) && this.isPossibleDestination( stop.id ) ) {
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

        this.$rootScope.footerPanel = this;

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
        const ids = await this.api.getBusStopsIdsByOrigin( originId );
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
        const ids = await this.api.getBusStopsIdsByRoute( originId, destinationId );
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
    public async getOriginPrevisions( originId: number, config?: IRequestShortcutConfig ): Promise<Prevision[]> {
        this.previsions = await this.api.getPrevisionsByOrigin( originId, config );
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
    public async getRoutePrevisions( originId: number, destinationId: number, config?: IRequestShortcutConfig ): Promise<Prevision[]> {
        this.previsions = await this.api.getPrevisionsByOriginAndDestination( originId, destinationId, config );
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
    public async getLinePrevisions( line: BusLine, config?: IRequestShortcutConfig ): Promise<Prevision[]> {
        this.previsions = await this.api.getPrevisionsByOriginAndLine( line.pontoDeOrigemId, line.linhaId, config );
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
        this.panTo( new L.LatLng( stop.latitude, stop.longitude ) );
    }

    /**
     * 
     * 
     * @param {L.LatLng} latlng 
     * 
     * @memberOf TranscolOnlineController
     */
    public panTo( latlng: L.LatLng ) {
        const newZoom = this.map.getZoom() < this.stopsCluster.options.disableClusteringAtZoom
            ? this.stopsCluster.options.disableClusteringAtZoom
            : this.map.getZoom();
        this.map.setView( latlng, newZoom, { animate: true, duration: 0.5 });
    }


    /**
     * 
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public goToFeedback() {
        this.transitionService.changeState( 'app.transcolOnlineFeedback' );
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberof TranscolOnlineController
     */
    private showAuthNeededModal() {
        const options = {
            controller: AuthNeededController,
            template: authNeededTemplate,
            bindToController: true,
            controllerAs: 'vm'
        };
        this.$mdDialog.show( options );
    }

    /**
   * Abre filtro(popup) por fonte da notícia
   */
    public async onFavoriteButtonClick( stop: BusStop ) {
        if ( this.authenticationService.isAnonymous ) {
            return this.showAuthNeededModal();
        }

        if ( this.isFavoriteStop( stop ) ) {
            this.storage.removeFromFavoriteStops( stop );
        } else {
            const options = {
                controller: FavoritesModalController,
                template: favoritesModalTemplate,
                bindToController: true,
                controllerAs: 'vm'
            };

            const type = await this.$mdDialog.show( options );
            this.storage.addToFavoriteStops( stop, type );
        }

        this.syncFavorites( true );
    }


    /**
     * 
     * 
     * @private
     * 
     * @memberof TranscolOnlineController
     */
    private async syncFavorites( hasNewData: boolean) {
        if ( !this.authenticationService.user.anonymous ) {
            await this.api.syncFavoriteStopsData( hasNewData );
            this.updateFavoritesFromLocalStorage();
        }
    }

    /**
     * 
     * 
     * @private
     * @param {BusStop} stop 
     * @returns {boolean} 
     * 
     * @memberof TranscolOnlineController
     */
    private isFavoriteStop( stop: BusStop ): boolean {
        if ( !stop ) {
            return false;
        }
        return this.storage.isFavoriteStop( stop );
    }

    /**
     * 
     * 
     * @memberOf TranscolOnlineController
     */
    public backButtonAction() {
        if ( this.isDetailsOpenned ) {
            this.closeDetails();
        } else {
            this.clearMapSelection();
        }
        this.$scope.$safeApply();
    }
    /* Private Methods */

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
    private isPossibleDestination( stopId: number ): boolean {
        return !!this.destinations.length && !!this.destinations.find( s => s.id === stopId );
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
        if ( this.$rootScope.footerPanel ) {
            delete this.$rootScope.footerPanel;
        }
        this.isDetailsOpenned = false;
        this.isSummaryOpenned = false;
    }

    private clearMapSelection() {
        this.unselectOrigin();
        this.showLabels = false;
    }
}

