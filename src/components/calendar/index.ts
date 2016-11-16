
import 'angular-ui-router';
import '@hoisel/ionic-calendar';
import '@hoisel/ionic-calendar-css';

import calendarComponent from './calendar.component';
import calendarShared from './shared/index';

const dependencies = [
    'ui.router', 'ui.rCalendar', calendarShared.name
];

export default angular.module( 'calendar.component', dependencies )
                      .directive( 'espmCalendar', calendarComponent )
                      .config( [
                          '$stateProvider', ( $stateProvider ) => {
                              $stateProvider
                                  .state( 'app.calendar', {
                                      url: 'agenda',
                                      data: { title: 'Agenda ES' },
                                      views: {
                                          content: {
                                              template: '<espm-calendar></espm-calendar>'
                                          }
                                      }
                                  } )
                                  .state( 'app.dashboard.calendar', {
                                      url: 'agenda',
                                      data: { title: 'AGENDA ES' },
                                      views: {
                                          'tab-calendar': {
                                              template: '<espm-calendar></espm-calendar>'
                                          }
                                      }
                                  } );
                          }
                      ] );

