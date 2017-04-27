import { BusLinesComponent } from './bus-lines/bus-lines.component';
import { BusInfoComponent } from './bus-info/bus-info.component';
import { DestinyListComponent } from './transcol-online/destiny-list/destiny-list.component';
import { PrevisionListComponent } from './transcol-online/prevision-list/prevision-list.component';
import { TranscolOnlineComponent } from './transcol-online/transcol-online.component';
import { StopIconComponent } from './transcol-online/stop-icon/stop-icon.component';
import { StopSummaryComponent } from './transcol-online/stop-summary/stop-summary.component';
import { CeturbStorage, CeturbApiService } from './shared/index';

export default angular.module( 'ceturb.module', [] )

    // services
    .service( 'ceturbStorage', CeturbStorage )
    .service( 'ceturbApiService', CeturbApiService )

    // components
    .directive( 'busLines', BusLinesComponent )
    .directive( 'busInfo', BusInfoComponent )
    .directive( 'transcolOnline', TranscolOnlineComponent )

    // widgets
    .component( 'destinyList', DestinyListComponent )
    .component( 'previsionList', PrevisionListComponent )
    .component( 'stopIcon', StopIconComponent )
    .component( 'stopSummary', StopSummaryComponent )

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