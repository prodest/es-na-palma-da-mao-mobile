import { CalendarComponent } from './calendar.component';
import { CalendarApiService } from './shared/index';

export default angular.module( 'calendar.module', [] )

    // services
    .service( 'calendarApiService', CalendarApiService )

    // components
    .directive( 'espmCalendar', CalendarComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.calendar', {
                    url: 'agenda',
                    views: {
                        content: {
                            template: '<espm-calendar></espm-calendar>'
                        }
                    }
                })
                .state( 'app.dashboard.calendar', {
                    url: 'agenda',
                    views: {
                        'tab-calendar': {
                            template: '<espm-calendar></espm-calendar>'
                        }
                    }
                });
        }
    ] ).name;

