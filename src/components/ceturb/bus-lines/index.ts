
import 'angular-ui-router';

import busLinesComponent from './bus-lines.component';
import ceturbShared from '../shared/index';

const dependencies = [
    'ui.router', ceturbShared.name
];

export default angular.module( 'bus-lines.component', dependencies )
                      .directive( 'busLines', busLinesComponent )
                      .config( [
                          '$stateProvider', ( $stateProvider ) => {
                              $stateProvider
                                  .state( 'app.busLines', {
                                      url: 'busLines',
                                      data: {title: 'Ceturb - Consulta de Ônibus'},
                                      views: {
                                          content: {
                                              template: '<bus-lines></bus-lines>'
                                          }
                                      }
                                  } );
                          }
                      ] );
