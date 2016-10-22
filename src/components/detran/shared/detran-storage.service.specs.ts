import { DetranStorage } from './detran-storage.service';
import { Vehicle, DriverLicense, VehicleData } from './models/index';
import { AuthenticationService } from '../../shared/authentication/index';

let expect = chai.expect;

describe( 'DetranStorage', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    let vehiclesStorageKey = 'detranVehicles';
    let detranStorage: DetranStorage;
    let $localStorage: any;
    let authenticationService: AuthenticationService;

    beforeEach(() => {
        $localStorage = {};
        authenticationService = <AuthenticationService><any>{
            user: {
                cfp: '12345678912',
                cnhNumero: '77777777777',
                cnhCedula: '88888888888'
            }
        };
        detranStorage = new DetranStorage( $localStorage, authenticationService );
        $localStorage[ vehiclesStorageKey ] = undefined;
    });

    describe( 'VehicleStorage', () => {

        describe( 'vehicles', () => {

            describe( 'get()', () => {
                it( 'should return vehicles from local storage', () => {
                    let userVehicles: Vehicle[] = [
                        { plate: 'ovl-1111', renavam: 111111111 },
                        { plate: 'ovl-2222', renavam: 222222222 }
                    ];

                    $localStorage[ vehiclesStorageKey ] = { id: 3292, vehicles: userVehicles, date: new Date() };

                    expect( detranStorage.vehiclesData.vehicles ).to.be.deep.equal( userVehicles );
                });

                it( 'should be empty if no vehicles exists on local storage', () => {
                    $localStorage[ vehiclesStorageKey ] = undefined;

                    expect( detranStorage.vehiclesData.vehicles ).to.be.deep.equal( [] );
                });
            });

            describe( 'set( vehicles )', () => {
                it( 'should save vehicles on local storage', () => {
                    let userVehicles: Vehicle[] = [ { plate: 'ovl-1111', renavam: 111111111 }];

                    detranStorage.vehiclesData.vehicles = userVehicles;
                    expect( $localStorage[ vehiclesStorageKey ].vehicles ).to.be.deep.equal( userVehicles );
                });
            });
        });

        describe( 'existsVehicle(vehicle)', () => {
            beforeEach(() => {
                let userVehicles: VehicleData = {
                    id: 9232,
                    vehicles: [
                        { plate: 'ovl-1111', renavam: 111111111 },
                        { plate: 'ovl-2222', renavam: 222222222 }
                    ],
                    date: new Date()
                };

                $localStorage[ vehiclesStorageKey ] = userVehicles;
            });

            it( 'should ignore case on search for plate', () => {
                expect( detranStorage.existsVehicle( { plate: 'ovl-1111', renavam: 0 }) ).to.be.true;
                expect( detranStorage.existsVehicle( { plate: 'OVL-1111', renavam: 0 }) ).to.be.true;
            });

            it( 'should return true if only plate matches any stored vehicle', () => {
                expect( detranStorage.existsVehicle( { plate: 'ovl-1111', renavam: 0 }) ).to.be.true;
            });

            it( 'should return true if only renavam matches any stored vehicle', () => {
                expect( detranStorage.existsVehicle( { plate: 'ovl-0000', renavam: 111111111 }) ).to.be.true;
            });

            it( 'should return false if plate and renavam doesn\'t match any stored vehicle', () => {
                expect( detranStorage.existsVehicle( { plate: 'ovl-0000', renavam: 0 }) ).to.be.false;
                expect( detranStorage.existsVehicle( { plate: 'ovl-3333', renavam: 333333333 }) ).to.be.false;
            });
        });

        describe( 'removeVehicle(vehicle)', () => {
            let userVehicles: VehicleData;

            beforeEach(() => {
                userVehicles = {
                    id: 9232,
                    vehicles: [
                        { plate: 'ovl-1111', renavam: 111111111 },
                        { plate: 'ovl-2222', renavam: 222222222 }
                    ],
                    date: new Date()
                };

                $localStorage[ vehiclesStorageKey ] = userVehicles;
            });

            it( 'should remove vehicle if only plate matches any stored vehicle', () => {
                let vehicleToRemove = { plate: 'ovl-1111', renavam: 0 };
                let vehicles = detranStorage.removeVehicle( vehicleToRemove );
                expect( vehicles ).to.not.contain( vehicleToRemove );
            });

            it( 'should remove vehicle if only renavam matches any stored vehicle', () => {
                let vehicleToRemove = { plate: 'ovl-0000', renavam: 111111111 };
                let vehicles = detranStorage.removeVehicle( vehicleToRemove );
                expect( vehicles ).to.not.contain( vehicleToRemove );
            });

            it( 'should remove vehicle if both plate and renavam matches any stored vehicle', () => {
                let vehicleToRemove = { plate: 'ovl-1111', renavam: 111111111 };
                let vehicles = detranStorage.removeVehicle( vehicleToRemove );
                expect( vehicles ).to.not.contain( vehicleToRemove );
            });

            it( 'should not remove vehicle if nor plate nor renavam matches any stored vehicle', () => {
                let vehicleToRemove = { plate: 'ovl-0000', renavam: 0 };
                let vehicles = detranStorage.removeVehicle( vehicleToRemove );
                expect( vehicles ).to.be.deep.equal( userVehicles );
            });
        });



        describe( 'addVehicle(vehicle)', () => {
            let userVehicles: VehicleData;

            beforeEach(() => {
                userVehicles = {
                    id: 9232,
                    vehicles: [
                        { plate: 'ovl-1111', renavam: 111111111 },
                        { plate: 'ovl-2222', renavam: 222222222 }
                    ],
                    date: new Date()
                };

                $localStorage[ vehiclesStorageKey ] = userVehicles;
            });

            it( 'should add vehicle if it is not already stored', () => {
                let newVehicle = { plate: 'ovl-0000', renavam: 0 };
                let vehicles = detranStorage.addVehicle( newVehicle );
                expect( vehicles.vehicles ).to.contain( newVehicle );
            });

            it( 'should not add vehicle if it is already stored', () => {
                userVehicles.vehicles.forEach( vehicle => {
                    let vehicles = detranStorage.addVehicle( vehicle );
                    expect( vehicles ).to.be.deep.equal( userVehicles );
                });
            });

            it( 'should always store plate in uppercase', () => {
                let newVehicle = { plate: 'ovl-0000', renavam: 0 };
                let vehicles = detranStorage.addVehicle( newVehicle ).vehicles;

                expect( vehicles[ vehicles.length - 1 ].plate ).to.be.equal( newVehicle.plate.toUpperCase() );
            });
        });
    });

    describe( 'DriverLicenseStorage', () => {
        describe( 'driverLicense', () => {

            describe( 'get()', () => {
                it( 'should return driverLicense filled by authenticationService.user', () => {
                    expect( detranStorage.driverLicense.ballot ).to.be.equal( authenticationService.user.cnhCedula );
                    expect( detranStorage.driverLicense.registerNumber ).to.be.equal( authenticationService.user.cnhNumero );
                });
            });

            describe( 'set( vehicles )', () => {
                it( 'should fill authenticationService.user with driverLicense data', () => {
                    let driverLicense: DriverLicense = { registerNumber: '9090909090', ballot: '8080808080' };

                    detranStorage.driverLicense = driverLicense;

                    expect( authenticationService.user.cnhCedula ).to.be.equal( detranStorage.driverLicense.ballot );
                    expect( authenticationService.user.cnhNumero ).to.be.equal( detranStorage.driverLicense.registerNumber );
                });
            });
        });

        describe( 'hasDriverLicense', () => {

            describe( 'get()', () => {
                it( 'should return true if cnh register number and ballot have value', () => {
                    authenticationService.user.cnhNumero = '111111111';
                    authenticationService.user.cnhCedula = '222222222';
                    expect( detranStorage.hasDriverLicense ).to.be.true;
                });

                it( 'should return false if cnh register number has not value', () => {
                    authenticationService.user.cnhNumero = '';
                    expect( detranStorage.hasDriverLicense ).to.be.false;
                });

                it( 'should return false if cnh ballot has no value', () => {
                    authenticationService.user.cnhCedula = '';
                    expect( detranStorage.hasDriverLicense ).to.be.false;
                });
            });

            describe( 'set( vehicles )', () => {
                it( 'should fill authenticationService.user with driverLicense data', () => {
                    let driverLicense: DriverLicense = { registerNumber: '9090909090', ballot: '8080808080' };

                    detranStorage.driverLicense = driverLicense;

                    expect( authenticationService.user.cnhCedula ).to.be.equal( detranStorage.driverLicense.ballot );
                    expect( authenticationService.user.cnhNumero ).to.be.equal( detranStorage.driverLicense.registerNumber );
                });
            });
        });
    });
});

