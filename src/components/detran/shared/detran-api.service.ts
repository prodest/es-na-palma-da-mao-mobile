import { IHttpService, IHttpPromiseCallbackArg } from 'angular';
import { ISettings } from '../../shared/settings/index';
import { DriverData, Ticket, Vehicle, DriverLicense, VehicleInfo, VehicleData } from './models/index';


export class DetranApiService {

    public static $inject: string[] = [ '$http', 'settings' ];

    /**
     * Creates an instance of DetranApiService.
     * 
     * @param {IHttpService} $http
     * @param {ISettings} settings
     * 
     * @memberOf DetranApiService
     */
    constructor( private $http: IHttpService, private settings: ISettings ) { }


    /**
     * 
     * @returns {Promise<DriverData>}
     */
    public getDriverData(): Promise<DriverData> {
        return this.$http.get( `${this.settings.api.detran}/driver` )
            .then(( response: IHttpPromiseCallbackArg<DriverData> ) => response.data );
    }

    /**
     * 
     * @returns {Promise<Ticket[]>}
     */
    public getDriverTickets(): Promise<Ticket[]> {
        return this.$http.get( `${this.settings.api.detran}/driver/tickets` )
            .then(( response: IHttpPromiseCallbackArg<Ticket[]> ) => response.data );
    }

    /**
     * 
     * @param {Vehicle} vehicle
     * @returns {Promise<Ticket[]>}
     */
    public getVehicleTickets( vehicle: Vehicle ): Promise<Ticket[]> {
        return this.$http.get( `${this.settings.api.detran}/vehicle/tickets`, { params: vehicle })
            .then(( response: IHttpPromiseCallbackArg<Ticket[]> ) => response.data );
    }

    /**
     * 
     * @param {Vehicle} vehicle
     * @returns {Promise<VehicleInfo>}
     */
    public getVehicleInfo( vehicle: Vehicle ): Promise<VehicleInfo> {
        return this.$http.get( `${this.settings.api.detran}/vehicle`, { params: vehicle })
            .then(( response: IHttpPromiseCallbackArg<VehicleInfo> ) => response.data );
    }

    /**
     * 
     * 
     * @param {VehicleData} vehicleData
     * @returns {Promise<VehicleData>}
     * 
     * @memberOf DetranApiService
     */
    public saveVehicleData( vehicleData: VehicleData ): Promise<VehicleData> {
        return this.$http.post( `${this.settings.api.espm}/data/vehicles`, vehicleData )
            .then(( response: IHttpPromiseCallbackArg<VehicleData> ) => response.data );
    }

    /**
     * 
     * @param {DriverLicense} license
     * @returns {Promise<any>}
     */
    public saveLicense( license: DriverLicense ): Promise<any> {
        const params = { numero: license.registerNumber, cedula: license.ballot };
        return this.$http.post( `${this.settings.api.acessocidadao}/Perfil/SalvarCNH`, params )
            .then(( response: IHttpPromiseCallbackArg<any> ) => response.data );
    }
}
