import { IScope, IWindowService } from 'angular';
import { ToastService } from '../../shared/shared.module';
import { CeturbApiService, CeturbStorage } from '../shared/index';
import { BusRoute, BusSchedule } from '../shared/models/index';

export class BusInfoController {

    public static $inject: string[] = [
        '$scope',
        '$stateParams',
        '$window',
        '$ionicTabsDelegate',
        'toast',
        'ceturbApiService',
        'ceturbStorage'
    ];

    public lineId: string;
    public route: BusRoute | undefined = undefined;
    public schedule: BusSchedule | undefined = undefined;
    public currentTime: string;

    /**
     * Creates an instance of BusInfoController.
     * 
     * @param {IScope} $scope
     * @param {angular.ui.IStateParamsService} $stateParams
     * @param {IWindowService} $window
     * @param {ionic.tabs.IonicTabsDelegate} $ionicTabsDelegate
     * @param {ToastService} toast
     * @param {CeturbApiService} ceturbApiService
     * @param {CeturbStorage} ceturbStorage
     * 
     * @memberOf BusInfoController
     */
    constructor( private $scope: IScope,
        private $stateParams: angular.ui.IStateParamsService,
        private $window: IWindowService,
        private $ionicTabsDelegate: ionic.tabs.IonicTabsDelegate,
        private toast: ToastService,
        private ceturbApiService: CeturbApiService,
        private ceturbStorage: CeturbStorage ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     *
     */
    public async activate() {
        this.lineId = this.$stateParams[ 'id' ];
        this.currentTime = new Date().toTimeString().slice( 0, 5 );

        try {
            let [ schedule, route ] = await Promise.all( [
                this.ceturbApiService.getSchedule( this.lineId ),
                this.ceturbApiService.getRoute( this.lineId )
            ] );

            this.schedule = schedule;
            this.route = route;
        } catch ( error ) {
            this.schedule = this.route = undefined;
        }
    }

    /**
     * 
     * 
     * @private
     * @param {string} time
     * @returns
     */
    public beforeNow( time: string ): boolean {
        return time.slice( 0, 5 ).localeCompare( this.currentTime ) === -1;
    }


    /**
     * 
     * 
     * @private
     * @param {string} text
     */
    public openMapLink( text: string ): void {
        if ( this.$scope.isIOS ) {
            this.$window.open( `maps://?q=${text}, ES`, '_system', 'location=yes' );
        } else {
            this.$window.open( `http://www.google.com.br/maps/place/${text}, ES`, '_system', 'location=yes' );
        }
    }

    /**
     * 
     * 
     * @param {string} tabIndex
     * 
     * @memberOf BusInfoController
     */
    public gotoTab( tabIndex: number ) {
        if ( tabIndex !== this.$ionicTabsDelegate.selectedIndex() ) {
            this.$ionicTabsDelegate.select( tabIndex );
        }
    }

    /**
     * 
     * 
     * @param {BusLine} line
     * 
     * @memberOf BusInfoController
     */
    public toggleFavorite(): void {
        if ( this.isFavorite ) {
            this.ceturbStorage.removeFromFavoriteLines( this.lineId );
            this.toast.info( { title: `Favorito removido` });
        }
        else {
            this.ceturbStorage.addToFavoriteLines( this.lineId );
            this.toast.info( { title: `Linha ${this.lineId} favoritada` });
        }
        this.ceturbApiService.syncFavoriteLinesData( true );
    }

    /**
     * 
     * 
     * @readonly
     * 
     * @memberOf BusInfoController
     */
    public get isFavorite() {
        return this.ceturbStorage.isFavoriteLine( this.lineId );
    }
}
