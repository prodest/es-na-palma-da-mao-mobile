// vendors
import './vendors';

// shared
import shared from '../shared/index';
import layout from '../layout/index';

// Features
import appComponent from './app.component';
import aboutComponent from '../about/index';
import homeComponent from '../home/index';
import loginComponent from '../login/index';
import cbmesComponent from '../cbmes/index';
import ceturbComponent from '../ceturb/index';
import dashBoardComponent from '../dashboard/index';
import detranComponent from '../detran/index';
import dioComponent from '../dio/index';
import newsComponent from '../news/index';
import sepComponent from '../sep/index';
import calendarComponent from '../calendar/index';

let dependencies = [
    'ionic',
    'ionic.native',
    'ngMaterial',
    'ngStorage',
    'ngAnimate',
    'ionic-native-transitions',
    'ui.router',

    // components
    shared.name,
    layout.name,
    aboutComponent.name,
    homeComponent.name,
    loginComponent.name,
    cbmesComponent.name,
    ceturbComponent.name,
    dashBoardComponent.name,
    detranComponent.name,
    dioComponent.name,
    newsComponent.name,
    dioComponent.name,
    sepComponent.name,
    calendarComponent.name
];

export default angular.module( 'app', dependencies )
    .directive( 'app', appComponent )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app', {
                    url: '/app/',
                    abstract: true,
                    template: '<menu></menu>'
                });
        }
    ] );
