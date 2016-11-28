import {DriverStatus} from './driverStatus';

export interface DriverData {
    status: DriverStatus;
    blockMotive?: string;
    expirationDate: Date;
    hasTickets: boolean;
    acquiringLicense: boolean;
    hasAdministrativeIssues: boolean;
}
