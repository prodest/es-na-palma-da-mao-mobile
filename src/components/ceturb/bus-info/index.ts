
import 'angular-ui-router';

import busInfoComponent from './bus-info.component';
import ceturbShared from '../shared/index';

const dependencies = [
    'ui.router', ceturbShared.name
];

export default angular.module( 'bus-info.component', dependencies )
                      .directive( 'busInfo', busInfoComponent )
                      .config( [
                          '$stateProvider', ( $stateProvider ) => {
                              $stateProvider
                                  .state( 'app.busInfo/:id', {
                                      url: 'busInfo/:id',
                                      data: {title: 'Detalhes da Linha'},
                                      views: {
                                          content: {
                                              template: '<bus-info></bus-info>'
                                          }
                                      }
                                  } );
                          }
                      ] );
