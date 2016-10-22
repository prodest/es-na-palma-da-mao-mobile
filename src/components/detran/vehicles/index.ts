
import 'angular-ui-router';

import VehiclesComponent from './vehicles.component';
import detranShared from '../shared/index';

const dependencies = [
    'ui.router', detranShared.name
];

export default angular.module( 'detran-vehicles.component', dependencies )
    .directive( 'detranVehicles', VehiclesComponent )
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.vehicles', {
                    url: 'detran/vehicles',
                    data: { title: 'DETRAN' },
                    views: {
                        content: {
                            template: '<detran-vehicles></detran-vehicles>'
                        }
                    }
                });
        }
    ] );
