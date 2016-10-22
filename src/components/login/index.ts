
import 'angular-ui-router';

import loginComponent from './login.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'login.component', dependencies )
                      .directive( 'login', loginComponent )
                      .config( [
                          '$stateProvider', ( $stateProvider ) => {
                              $stateProvider
                                  .state( 'login', {
                                      url: 'login',
                                      template: '<login></login>'
                                  } );
                          }
                      ] );


