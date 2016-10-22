import driverLicense from './driver-license/index';
import driverLicenseStatus from './driver-license-status/index';
import vehicleTickets from './vehicle-tickets/index';
import vehicles from './vehicles/index';
import shared from './shared/index';

let dependencies = [
    driverLicense.name,
    driverLicenseStatus.name,
    shared.name,
    vehicleTickets.name,
    vehicles.name
];

export default angular.module( 'detran', dependencies );