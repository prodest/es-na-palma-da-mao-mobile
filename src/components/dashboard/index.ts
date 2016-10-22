import 'angular-ui-router';


import dashBoardComponent from './dashboard.component';

const dependencies = [
    'ui.router'
];

export default angular.module( 'dashboard.component', dependencies )
                      .directive( 'dashboard', dashBoardComponent )
                      .config( [
                          '$stateProvider', ( $stateProvider ) => {
                              $stateProvider
                                  .state( 'app.dashboard', {
                                      url: 'dashboard/',
                                      data: { title: 'Dashboard' },
                                      abstract: true,
                                      views: {
                                          content: {
                                              template: '<dashboard></dashboard>'
                                          }
                                      }
                                  } );
                          }
                      ] );





