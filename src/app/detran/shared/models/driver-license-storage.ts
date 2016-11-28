import { DriverLicense } from './driverLicense';

export interface DriverLicenseStorage {
    driverLicense: DriverLicense;
    hasDriverLicense: boolean;
}