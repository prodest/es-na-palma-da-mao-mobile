import { VehicleInfo } from './vehicleInfo';

export interface Vehicle {
    plate: string;
    renavam: number;
    info?: VehicleInfo;
}
