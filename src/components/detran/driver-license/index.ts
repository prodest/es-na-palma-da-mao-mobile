
import 'angular-ui-router';

import driverLicenseComponent from './driver-license.component';
import detranShared from '../shared/index';

const dependencies = [
    'ui.router', detranShared.name
];

export default angular.module( 'driver-license.component', dependencies )
    .directive( 'driverLicense', driverLicenseComponent )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.driverLicense', {
                    url: 'driverLicense',
                    data: { title: 'Cadastro de CNH' },
                    views: {
                        content: {
                            template: '<driver-license></driver-license>'
                        }
                    }
                });
        }
    ] );
