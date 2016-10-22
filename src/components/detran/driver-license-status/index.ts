
import 'angular-ui-router';

import licenseStatusComponent from './driver-license-status.component';
import detranShared from '../shared/index';

const dependencies = [
    'ui.router', detranShared.name
];

export default angular.module( 'driver-license-status.component', dependencies )
                      .directive( 'driverLicenseStatus', licenseStatusComponent )
                      .config( [
                          '$stateProvider', ( $stateProvider ) => {
                              $stateProvider
                                  .state( 'app.driverLicenseStatus', {
                                      url: 'driverLicenseStatus',
                                      data: { title: 'Situação CNH' },
                                      views: {
                                          content: {
                                              template: '<driver-license-status></driver-license-status>'
                                          }
                                      }
                                  } );
                          }
                      ] );
