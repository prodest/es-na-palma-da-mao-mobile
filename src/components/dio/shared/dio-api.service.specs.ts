import { DioApiService } from './dio-api.service';
import { Settings, ISettings } from '../../shared/settings/index';
import { SearchFilter } from '../shared/models/index';
import { $httpMock } from '../../shared/tests/index';

let expect = chai.expect;

describe( 'DioApiService', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    let dioApiService: DioApiService;
    let $httpGet: Sinon.SinonStub;
    let settings: ISettings;
    const fakeResponse = {
        data: {
            fake: 'fakeValue'
        }
    };

    beforeEach(() => {
        $httpGet = sandbox.stub( $httpMock, 'get' );
        $httpGet.returnsPromise().resolves( fakeResponse );
        settings = Settings.getInstance();

        dioApiService = new DioApiService( $httpMock, settings );
    });

    describe( 'getLatestEditions()', () => {

        it( 'should call /dio/latest endpoint on dio api', () => {
            dioApiService.getLatestEditions();

            expect( $httpGet.calledWith( `${settings.api.dio}/latest` ) ).to.be.true;
        });

        it( 'should normalize response to response.data property', () => {
            dioApiService.getLatestEditions().then(( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data );
            });
        });

    });


    describe( 'search(filter)', () => {
        let filter: SearchFilter;

        beforeEach(() => {
            filter = {
                query: 'ana',
                dateMin: new Date(),
                dateMax: new Date(),
                pageNumber: 10,
                sort: 'name'
            };
        });

        it( 'should call /dio/search endpoint on dio api passing all provided parameters', () => {
            dioApiService.search( filter );

            expect( $httpGet.calledWithExactly( `${settings.api.dio}/search`, { params: filter }) ).to.be.true;
        });

        it( 'should use default values if no filter is provided', () => {

            dioApiService.search( <SearchFilter>{});

            expect( $httpGet.calledWithMatch( `${settings.api.dio}/search`, {
                params: {
                    pageNumber: settings.pagination.pageNumber,
                    sort: 'date'
                }
            }) ).to.be.true;
        });

        it( 'should normalize response to response.data property', () => {
            dioApiService.search( filter ).then(( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data );
            });
        });
    });
});

