import { DriverLicenseComponent } from './driver-license/driver-license.component';
import { DriverLicenseStatusComponent } from './driver-license-status/driver-license-status.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleTicketsComponent } from './vehicle-tickets/vehicle-tickets.component';
import { DetranApiService, DetranStorage, TicketColorService, DriverLicenseStorage } from './shared/index';

export { DriverLicenseStorage };

export default angular.module( 'detran.module', [] )

    // services
    .service( 'detranApiService', DetranApiService )
    .service( 'ticketColorService', TicketColorService )
    .service( 'detranStorage', DetranStorage )

    // components
    .directive( 'driverLicense', DriverLicenseComponent )
    .directive( 'driverLicenseStatus', DriverLicenseStatusComponent )
    .directive( 'vehicles', VehiclesComponent )
    .directive( 'vehicleTickets', VehicleTicketsComponent )

    // routes
    .config( [
        '$stateProvider', ( $stateProvider ) => {
            $stateProvider
                .state( 'app.driverLicense', {
                    url: 'driverLicense',
                    views: {
                        content: {
                            template: '<driver-license></driver-license>'
                        }
                    }
                })
                .state( 'app.driverLicenseStatus', {
                    url: 'driverLicenseStatus',
                    views: {
                        content: {
                            template: '<driver-license-status></driver-license-status>'
                        }
                    }
                })
                .state( 'app.vehicles', {
                    url: 'detran/vehicles',
                    views: {
                        content: {
                            template: '<vehicles></vehicles>'
                        }
                    }
                })
                .state( 'app.vehicleTickets/:plate/:renavam', {
                    url: 'detran/vehicle/tickets/:plate/:renavam',
                    views: {
                        content: {
                            template: '<vehicle-tickets></vehicle-tickets>'
                        }
                    }
                });
        }
    ] )
    .name;