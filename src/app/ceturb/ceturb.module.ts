import { BusLinesComponent } from './bus-lines/bus-lines.component';
import { BusInfoComponent } from './bus-info/bus-info.component';
import { DestinationListComponent } from './transcol-online/destination-list/destination-list.component';
import { TranscolOnlineComponent } from './transcol-online/transcol-online.component';
import { StopIconComponent } from './transcol-online/stop-icon/stop-icon.component';
import { StopSummaryComponent } from './transcol-online/stop-summary/stop-summary.component';
import { RoutePrevisionsListComponent } from './transcol-online/route-previsions-list/route-previsions-list.component';
import { OriginPrevisionsListComponent } from './transcol-online/origin-previsions-list/origin-previsions-list.component';
import { LinePrevisionsListComponent } from './transcol-online/line-previsions-list/line-previsions-list.component';
import { MapLabelsComponent } from './transcol-online/map-labels/map-labels.component';
import { TranscolOnlineStorage } from './transcol-online/shared/index';
import { GeolocationComponent } from './transcol-online/geolocation/geolocation.component';
import { TranscolOnlineApiService } from './transcol-online/shared/index';
import { CeturbStorage, CeturbApiService } from './shared/index';

export default angular.module( 'ceturb.module', [] )

    // services
    .service( 'ceturbStorage', CeturbStorage )
    .service( 'transcolOnlineStorage', TranscolOnlineStorage )
    .service( 'transcolOnlineApiService', TranscolOnlineApiService )
    .service( 'ceturbApiService', CeturbApiService )

    // components
    .directive( 'busLines', BusLinesComponent )
    .directive( 'busInfo', BusInfoComponent )
    .directive( 'transcolOnline', TranscolOnlineComponent )

    // widgets
    .component( 'destinationList', DestinationListComponent )
    .component( 'stopIcon', StopIconComponent )
    .component( 'stopSummary', StopSummaryComponent )
    .component( 'routePrevisionsList', RoutePrevisionsListComponent )
    .component( 'originPrevisionsList', OriginPrevisionsListComponent )
    .component( 'linePrevisionsList', LinePrevisionsListComponent )
    .component( 'mapLabels', MapLabelsComponent )
    .component( 'geolocation', GeolocationComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.busLines', {
                    url: 'busLines',
                    views: {
                        content: {
                            template: '<bus-lines></bus-lines>'
                        }
                    }
                })
                .state( 'app.busInfo/:id', {
                    url: 'busInfo/:id',
                    views: {
                        content: {
                            template: '<bus-info></bus-info>'
                        }
                    }
                })
                .state( 'app.transcolOnline', {
                    url: 'transcolOnline',
                    views: {
                        content: {
                            template: '<transcol-online></transcol-online>'
                        }
                    }
                });
        }
    ] )
    .name;