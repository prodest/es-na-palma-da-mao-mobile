import { Vehicle, DriverLicense, DriverLicenseStorage, VehicleStorage, VehicleData } from './models/index';
import { AuthenticationService } from '../../security/security.module';
import { DetranApiService } from './index';

/**
 * Serviço que trata local storage no contexto do detran
 * 
 * @export
 * @class DetranStorage
 * @implements {DriverLicenseStorage}
 * @implements {VehicleStorage}
 */
export class DetranStorage implements DriverLicenseStorage, VehicleStorage {

    public static $inject: string[] = [ '$localStorage', 'authenticationService', 'detranApiService' ];


    /************************************** Vehicle **************************************/

    private vehiclesStorageKey: string = 'detranVehicles';

    /**
     * Creates an instance of DetranStorage.
     * 
     * @param {*} $localStorage
     * @param {AuthenticationService} authenticationService
     * 
     * @memberOf DetranStorage
     */
    constructor( private $localStorage: any,
        private authenticationService: AuthenticationService,
        private detranApiService: DetranApiService ) {
    }

    /**
     * 
     * 
     * @param {boolean} [hasNewData=false]
     * 
     * @memberOf DetranStorage
     */
    public async sync( hasNewData: boolean = false ) {

        if ( hasNewData ) {
            this.vehiclesData.date = new Date();
        }

        this.vehiclesData = await this.detranApiService.saveVehicleData( this.vehiclesData );
    }

    /**
     * 
     * 
     * @readonly
     * @private
     * @type {Vehicle[]}
     * @memberOf DetranStorage
     */
    public get vehicles(): Vehicle[] {
        return this.vehiclesData.vehicles;
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     * @returns {boolean}
     */
    public containsVehicle( vehicle: Vehicle ): boolean {
        const existsPlaca = this.vehicles
            .map( v => v.plate.toUpperCase() )
            .indexOf( vehicle.plate.toUpperCase() );

        const existsRENAVAM = this.vehicles
            .map( v => v.renavam )
            .indexOf( vehicle.renavam );

        return existsPlaca !== -1 || existsRENAVAM !== -1;
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     * @returns {Vehicle[]}
     * 
     * @memberOf DetranStorage
     */
    public removeVehicle( vehicle: Vehicle ): Vehicle[] {
        this.vehiclesData.vehicles = this.vehicles.filter(( v1: Vehicle ) => {
            return v1.plate !== vehicle.plate && v1.renavam !== vehicle.renavam;
        });

        this.sync( true );

        return this.vehiclesData.vehicles;
    }

    /**
     * 
     * 
     * @param {Vehicle} vehicle
     * @returns {Promise<Vehicle[]>}
     * 
     * @memberOf DetranStorage
     */
    public async addVehicle( vehicle: Vehicle ): Promise<Vehicle[]> {
        if ( !this.containsVehicle( vehicle ) ) {
            vehicle.info = await this.detranApiService.getVehicleInfo( vehicle );
            vehicle.plate = vehicle.plate.toUpperCase();
            vehicle.renavam = vehicle.renavam;

            this.vehicles.push( vehicle );

            this.sync( true );
        }
        return this.vehicles;
    }



    /************************************** DriverLicense **************************************/
    /**
     * 
     * 
     * @type {DriverLicense}
     * @memberOf DetranStorage
     */
    public get driverLicense(): DriverLicense {
        return {
            registerNumber: this.authenticationService.user.cnhNumero,
            ballot: this.authenticationService.user.cnhCedula
        };
    }


    /**
     * 
     * 
     * 
     * @memberOf DetranStorage
     */
    public set driverLicense( driverLicense: DriverLicense ) {
        this.authenticationService.user.cnhNumero = driverLicense.registerNumber;
        this.authenticationService.user.cnhCedula = driverLicense.ballot;
    }

    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     * @memberOf DetranStorage
     */
    public get hasDriverLicense(): boolean {
        return !!this.driverLicense.registerNumber && !!this.driverLicense.ballot;
    }




    /************************************** Private api **************************************/

    /**
     * 
     * 
     * @type {VehicleData}
     * @memberOf DetranStorage
     */
    private get vehiclesData(): VehicleData {
        this.$localStorage[ this.vehiclesStorageKey ] = this.$localStorage[ this.vehiclesStorageKey ] || { vehicles: [] };
        return this.$localStorage[ this.vehiclesStorageKey ] as VehicleData;
    }

    /**
     * 
     * 
     * 
     * @memberOf DetranStorage
     */
    private set vehiclesData( vehicleData: VehicleData ) {
        this.$localStorage[ this.vehiclesStorageKey ] = vehicleData;
    }
}
