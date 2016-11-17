import { SearchController } from './search.component.controller';
import SearchComponent from './search.component';
import SearchTemplate = require( './search.component.html' );
import { Hit, SearchResult, DioApiService, SearchFilter } from '../shared/index';
import filterTemplate = require( './filter/filter.html' );
import { FilterController } from './filter/filter.controller';
import { environment, $windowMock, $mdDialogMock } from '../../shared/tests/index';
import { SocialSharing } from 'ionic-native';

let expect = chai.expect;

describe( 'Dio/search', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: SearchController;
        let dioApiService: DioApiService;

        beforeEach(() => {
            environment.refresh();
            dioApiService = <DioApiService><any>{ search: () => { } };
            controller = new SearchController( environment.$scope, $windowMock, $mdDialogMock, dioApiService );
        });

        describe( 'on instantiation', () => {

            it( 'should have total hits === 0', () => {
                expect( controller.totalHits ).to.be.equal( 0 );
            });

            it( 'should have an empty list of hits', () => {
                expect( controller.hits ).to.be.undefined;
            });

            it( 'should have no more hits to show', () => {
                expect( controller.hasMoreHits ).to.be.false;
            });

            it( 'should have no last query', () => {
                expect( controller.lastQuery ).to.be.undefined;
            });

            it( 'should have searched flag === false', () => {
                expect( controller.searched ).to.be.false;
            });

            it( 'should have a default filter', () => {
                expect( controller.filter ).to.be.deep.equal( {
                    pageNumber: 0,
                    sort: 'date'
                });
            });
        });

        describe( 'share( news )', () => {
            it( 'should share hit', () => {
                let shareWithOptions = sandbox.stub( SocialSharing, 'shareWithOptions' );
                let hit = <Hit><any>{
                    date: '10/02/1922',
                    pageNumber: '12',
                    pageUrl: 'www.pageurl.com'
                };

                controller.share( hit );

                expect( shareWithOptions.calledWithExactly( {
                    message: `DIO ES - ${hit.date} - Pág. ${hit.pageNumber}`,
                    subject: `DIO ES - ${hit.date} - Pág. ${hit.pageNumber}`,
                    url: hit.pageUrl
                }) ).to.be.true;
            });
        });

        describe( 'search(filter)', () => {

            describe( 'on success:', () => {
                let freshHits: Hit[];
                let alreadyLoadedHits: Hit[];
                let searchResult: SearchResult;
                let searchApi: Sinon.SinonPromise;

                beforeEach(() => {
                    alreadyLoadedHits = <Hit[]>[ { editionUrl: 'urlA' }, { editionUrl: 'urlB' }];
                    freshHits = <Hit[]>[ { editionUrl: 'urlC' }, { editionUrl: 'urlD' }];
                    searchResult = { hits: freshHits, totalHits: 1000 };
                    searchApi = sandbox.stub( dioApiService, 'search' ).returnsPromise();
                    searchApi.resolves( searchResult );

                    // configure controller
                    controller.hits = alreadyLoadedHits;
                });

                it( 'should append returned hits to already loaded ones (if paginating)', async () => {
                    controller.filter.pageNumber = 2;

                    await controller.search( controller.filter );

                    expect( controller.hits ).to.deep.equal( alreadyLoadedHits.concat( freshHits ) );
                });

                it( 'should replace existing hits with freshing ones (on initial load)', async () => {
                    controller.filter.pageNumber = 0;

                    await controller.search( controller.filter );

                    expect( controller.hits ).to.deep.equal( freshHits );
                });

                it( 'should fill totalHits', async () => {
                    await controller.search( controller.filter );

                    expect( controller.totalHits ).to.be.equal( searchResult.totalHits );
                });

                it( 'should set searched flag to true', async () => {
                    controller.searched = false;

                    await controller.search( controller.filter );

                    expect( controller.searched ).to.be.true;
                });

                it( 'should copy filter.query to lastQuery property', async () => {
                    controller.lastQuery = 'hoisel';
                    controller.filter.query = 'SECOM';

                    await controller.search( controller.filter );

                    expect( controller.filter.query ).to.be.equal( controller.lastQuery );
                });

                it( 'should have no more hits if no hits returned', async () => {

                    await controller.search( controller.filter );

                    expect( controller.hasMoreHits ).to.be.true;

                    searchApi.resolves( { hits: [], totalHits: 1000 });

                    await controller.search( controller.filter );

                    expect( controller.hasMoreHits ).to.be.false;
                });

                it( 'should broadcast scroll.infiniteScrollComplete event', async () => {
                    let $broadcast = sandbox.spy( environment.$scope, '$broadcast' );

                    await controller.search( controller.filter );

                    expect( $broadcast.called ).to.be.true;
                });
            });

            describe( 'on error:', () => {
                let searchApi: Sinon.SinonPromise;

                beforeEach(() => {
                    searchApi = sandbox.stub( dioApiService, 'search' ).returnsPromise();
                    searchApi.rejects();
                });

                it( 'should unload hits', async () => {
                    await controller.search( controller.filter );

                    expect( controller.hits ).to.be.undefined;
                });

                it( 'should clear lasQuery property', async () => {
                    await controller.search( controller.filter );

                    expect( controller.lastQuery ).to.be.undefined;
                });

                it( 'should have total hits === 0', async () => {
                    await controller.search( controller.filter );

                    expect( controller.totalHits ).to.be.equal( 0 );
                });

                it( 'should has no more hits', async () => {
                    await controller.search( controller.filter );

                    expect( controller.hasMoreHits ).to.be.false;
                });
            });
        });

        describe( 'openFilter()', async () => {

            let $mdDialogShow: Sinon.SinonStub;

            beforeEach(() => {
                $mdDialogShow = sandbox.stub( $mdDialogMock, 'show' );
                $mdDialogShow.returnsPromise().resolves( { pageNumber: 20, sort: 'date' });
            });

            it( 'should open filter', async () => {

                controller.filter = {
                    pageNumber: 1,
                    sort: 'date'
                };

                await controller.openFilter();

                expect( $mdDialogShow.calledWithExactly( {
                    controller: FilterController,
                    template: filterTemplate,
                    bindToController: true,
                    controllerAs: 'vm',
                    locals: controller.filter
                }) ).to.be.true;
            });

            describe( 'on filter edited:', () => {

                let userFilter: SearchFilter;
                let search: Sinon.SinonStub;

                beforeEach( async () => {
                    userFilter = {
                        pageNumber: 100,
                        sort: 'date'
                    };
                    search = sandbox.stub( controller, 'search' );
                    $mdDialogShow.returnsPromise().resolves( userFilter );

                    await controller.openFilter();
                });

                it( 'should search DIO with the provided filter', () => {
                    expect( search.calledWithExactly( userFilter ) ).to.be.true;
                });

                it( 'should reset pagination to first page', () => {
                    expect( userFilter.pageNumber ).to.be.equal( 0 );
                });
            });


            describe( 'open()', () => {
                it( 'should open edition or page', () => {
                    let $windowOpen = sandbox.stub( $windowMock, 'open' );

                    controller.open( 'edition-url' );

                    expect( $windowOpen.calledWith( 'edition-url' ) ).to.be.true;
                });
            });
        });
    });

    describe( 'Component', () => {
        // test the component/directive itself
        let component = SearchComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( SearchController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( SearchTemplate );
        });

        it( 'should use controllerAs', () => {
            expect( component ).to.have.property( 'controllerAs' );
        });

        it( 'should use controllerAs "vm"', () => {
            expect( component.controllerAs ).to.equal( 'vm' );
        });

        it( 'should use bindToController: true', () => {
            expect( component ).to.have.property( 'bindToController' );
            expect( component.bindToController ).to.equal( true );
        });
    });
});
