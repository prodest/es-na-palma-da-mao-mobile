import { NewsApiService } from './news-api.service';
import { Settings, ISettings } from '../../shared/settings/index';
import { Filter, Pagination } from '../shared/models/index';

let expect = chai.expect;

describe( 'NewsApiService', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    let newsApiService: NewsApiService;
    let $httpGet: Sinon.SinonStub;
    let $httpPost: Sinon.SinonStub;
    let settings: ISettings;
    const fakeResponse = {
        data: {
            fake: 'fakeValue'
        }
    };

    beforeEach(() => {
        let $http: any = { get() { }, post() { } };
        $httpGet = sandbox.stub( $http, 'get' );
        $httpGet.returnsPromise().resolves( fakeResponse );
        $httpPost = sandbox.stub( $http, 'post' );
        $httpPost.returnsPromise().resolves( fakeResponse );
        settings = Settings.getInstance();

        newsApiService = new NewsApiService( $http, settings );
    });

    describe( 'getNewsById(id)', () => {

        it( 'should call /news/id endpoint on news api', () => {
            newsApiService.getNewsById( '15' );

            expect( $httpGet.calledWith( `${settings.api.news}/15` ) ).to.be.true;
        });

        it( 'should normalize response to response.data property', () => {
            newsApiService.getNewsById( '15' ).then(( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data );
            });
        });

    });


    describe( 'getHighlightNews()', () => {

        it( 'should call /news/highlights endpoint on news api', () => {
            newsApiService.getHighlightNews();

            expect( $httpGet.calledWith( `${settings.api.news}/highlights` ) ).to.be.true;
        });

        it( 'should normalize response to response.data property', () => {
            newsApiService.getHighlightNews().then(( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data );
            });
        });
    });


    describe( 'getAvailableOrigins()', () => {

        it( 'should call /news/origins endpoint on news api', () => {
            newsApiService.getAvailableOrigins();

            expect( $httpGet.calledWith( `${settings.api.news}/origins` ) ).to.be.true;
        });

        it( 'should normalize response to response.data property', () => {
            newsApiService.getAvailableOrigins().then(( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data );
            });
        });
    });

    describe( 'getNews(filter,pagination)', () => {
        let filter: Filter;
        let pagination: Pagination;

        beforeEach(() => {
            filter = {
                origins: [ 'SESA' ],
                dateMin: new Date( 2015, 1, 1 ),
                dateMax: new Date( 2016, 1, 1 )
            };
            pagination = {
                pageNumber: 3,
                pageSize: 15
            };
        });

        it( 'should call /news endpoint on news api passing all provided parameters', () => {
            let params = angular.extend( {}, filter, pagination );

            newsApiService.getNews( filter, pagination );

            expect( $httpGet.calledWithExactly( `${settings.api.news}`, { params: params }) ).to.be.true;
        });

        it( 'should use default values if no filter or pagination is provided', () => {

            newsApiService.getNews( {}, {});

            expect( $httpGet.calledWithMatch( `${settings.api.news}`, {
                params: {
                    origins: [],
                    pageNumber: settings.pagination.pageNumber,
                    pageSize: settings.pagination.pageSize
                }
            }) ).to.be.true;
        });

        it( 'should normalize response to response.data property', () => {
            newsApiService.getNews( filter, pagination ).then(( data ) => {
                expect( data ).to.deep.equal( fakeResponse.data );
            });
        });
    });
});

