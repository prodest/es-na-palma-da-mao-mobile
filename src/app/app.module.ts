// vendors
import './vendors';

import { AppComponent } from './app.component';

// shared
import sharedModule from './shared/shared.module';
import layoutModule from './layout/layout.module';

// Features
import aboutModule from './about/about.module';
import homeModule from './home/home.module';
import securityModule from './security/security.module';
import cbmesModule from './cbmes/cbmes.module';
import ceturbModule from './ceturb/ceturb.module';
import dashBoardModule from './dashboard/dashboard.module';
import detranModule from './detran/detran.module';
import dioModule from './dio/dio.module';
import newsModule from './news/news.module';
import sepModule from './sep/sep.module';
import calendarModule from './calendar/calendar.module';
import secontModule from './secont/secont.module';

let dependencies = [
    // angular modules
    'ngMaterial',
    'ngStorage',
    'ngAnimate',

    // 3rd party vendor modules
    'ionic',
    'ionic.native',
    'ionic-native-transitions',
    'ui.router',
    'ui.rCalendar',
    'chart.js',

    // custom
    sharedModule,
    layoutModule,
    aboutModule,
    homeModule,
    securityModule,
    cbmesModule,
    ceturbModule,
    dashBoardModule,
    detranModule,
    dioModule,
    newsModule,
    dioModule,
    sepModule,
    calendarModule,
    secontModule
];

export default angular.module( 'app.module', dependencies )
    .directive( 'app', AppComponent )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app', {
                    url: '/app/',
                    abstract: true,
                    template: '<app></app>'
                });
        }
    ] )
    .name;

