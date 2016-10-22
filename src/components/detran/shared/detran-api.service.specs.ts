/*
 eslint
 no-undef: 0,
 dot-notation: 0,
 angular/di: 0,
 no-unused-expressions: 0
 */
import { DetranApiService } from './detran-api.service';
import { Settings, ISettings } from '../../shared/settings/index';
import { Vehicle, DriverLicense } from './models/index';
import { DetranStorage } from './index';

let expect = chai.expect;

describe( 'DetranApiService', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach( () => sandbox = sinon.sandbox.create() );
    afterEach( () => sandbox.restore() );

    let detranStorage: DetranStorage;
    let detranApiService: DetranApiService;
    let $httpGet: Sinon.SinonStub;
    let $httpPost: Sinon.SinonStub;
    let settings: ISettings;
    const fakeResponse = {
        data: {
            fake: 'fakeValue'
        }
    };

    beforeEach( () => {
        let $http: any = { get() {}, post() {} };
        $httpGet = sandbox.stub( $http, 'get' );
        $httpGet.returnsPromise().resolves( fakeResponse );
        $httpPost = sandbox.stub( $http, 'post' );
        $httpPost.returnsPromise().resolves( fakeResponse );
        settings = Settings.getInstance();

        detranApiService = new DetranApiService( $http, settings, detranStorage );
    } );

    describe( 'getDriverData()', () => {

        it( 'should call /driver endpoint on detran api', () => {
            detranApiService.getDriverData();

            expect( $httpGet.calledWith( `${settings.api.detran}/driver` ) ).to.be.true;
        } );

        it( 'should normalize response to response.data property', () => {
            detranApiService.getDriverData().then( ( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data );
            } );
        } );

    } );


    describe( 'getDriverTickets()', () => {

        it( 'should call /driver/tickets endpoint on detran api', () => {
            detranApiService.getDriverTickets( );

            expect( $httpGet.calledWith( `${settings.api.detran}/driver/tickets` ) ).to.be.true;
        } );

        it( 'should normalize response to response.data property', () => {
            detranApiService.getDriverTickets().then( ( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data );
            } );
        } );
    } );


    describe( 'getVehicleTickets()', () => {

        it( 'should call /vehicle/tickets endpoint on detran api', () => {
            const vehicle = { plate: 'ovl-7878', renavam: 12344555 };
            const params = { params: vehicle };

            detranApiService.getVehicleTickets( vehicle );

            expect( $httpGet.calledWith( `${settings.api.detran}/vehicle/tickets`, params ) ).to.be.true;
        } );

        it( 'should normalize response to response.data property', () => {
            detranApiService.getDriverTickets().then( ( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data );
            } );
        } );
    } );


    describe( 'getVehicleInfo()', () => {

        it( 'should call /vehicle endpoint on detran api', () => {
            const vehicle = { plate: 'ovl-7878', renavam: 12344555 };
            const params = { params: vehicle };

            detranApiService.getVehicleInfo( vehicle );

            expect( $httpGet.calledWith( `${settings.api.detran}/vehicle`, params ) ).to.be.true;
        } );

        it( 'should normalize response to response.data property', () => {
            detranApiService.getVehicleInfo( <Vehicle>{} ).then( ( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data );
            } );
        } );
    } );

    describe( 'saveLicense()', () => {

        it( 'should call /Perfil/SalvarCNH endpoint on acessocidadao api', () => {

            const license = { registerNumber: '1234', ballot: '3423434' };
            const params = { numero: license.registerNumber, cedula: license.ballot };

            detranApiService.saveLicense( license );

            expect( $httpPost.calledWith( `${settings.api.acessocidadao}/Perfil/SalvarCNH`, params ) ).to.be.true;
        } );

        it( 'should normalize response to response.data property', () => {
            detranApiService.saveLicense( <DriverLicense>{} ).then( ( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data  );
            } );
        } );
    } );
} );

