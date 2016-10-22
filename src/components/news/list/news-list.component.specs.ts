import * as moment from 'moment';
import { NewsListController } from './news-list.component.controller';
import { NewsApiService, News, Filter } from '../shared/index';
import NewsListComponent from './news-list.component';
import NewsListTemplate = require('./news-list.component.html');
import datesFilterTemplate = require('./dates-filter/dates-filter.html');
import { SourcesFilterController, sourcesFilterTemplate } from '../../layout/sources-filter/index';
import { DatesFilterController } from './dates-filter/dates-filter.controller';
import { environment, $mdDialogMock } from '../../shared/tests/index';
import { TransitionService } from '../../shared/index';

let expect = chai.expect;

describe( 'News/news-list', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: NewsListController;
        let newsApiService: NewsApiService;
        let availableOrigins = [ 'SESA', 'SEJUS', 'SEGER' ];
        let transitionService: TransitionService;

        beforeEach(() => {
            environment.refresh();
            newsApiService = <NewsApiService><any>{
                getNews: () => { },
                getAvailableOrigins: () => { }
            };
            transitionService = <TransitionService><any>{
                changeState: () => { }
            };
            controller = new NewsListController( environment.$scope, $mdDialogMock, newsApiService, transitionService );
        });

        describe( 'on instantiation', () => {

            it( 'should have a empty news list', () => {
                expect( controller.news ).to.be.undefined;
            });

            it( 'should have a empty list of news sources', () => {
                expect( controller.availableOrigins ).to.be.undefined;
            });

            it( 'should has more news to show', () => {
                expect( controller.hasMoreNews ).to.be.true;
            });

            it( 'should have a filter', () => {
                expect( controller.filter ).to.be.deep.equal( {});
            });

            it( 'should have a default pagination', () => {
                expect( controller.pagination ).to.be.deep.equal( {
                    pageNumber: 1,
                    pageSize: 10
                });
            });

            it( 'should activate on $ionicView.loaded event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                environment.onIonicLoadedEvent();

                expect( activate.called ).to.be.true;
            });
        });

        describe( 'activate()', () => {
            beforeEach(() => {
                sandbox.stub( newsApiService, 'getAvailableOrigins' ).returnsPromise().resolves( availableOrigins );
            });

            it( 'should fetch all available sources of news', () => {
                let getAvailableOrigins = sandbox.spy( controller, 'getAvailableOrigins' );

                controller.activate();

                expect( getAvailableOrigins.called ).to.be.true;
            });
        });

        describe( 'getAvailableOrigins()', () => {

            beforeEach(() => {
                sandbox.stub( newsApiService, 'getAvailableOrigins' ).returnsPromise().resolves( availableOrigins );
            });

            it( 'should fill list of available sources', () => {
                controller.getAvailableOrigins();

                expect( controller.availableOrigins ).to.deep.equal( availableOrigins );
            });

            it( 'should select all filter sources', () => {
                controller.getAvailableOrigins();

                expect( controller.filter.origins ).to.deep.equal( availableOrigins );
            });
        });


        // describe.skip( 'getNews(filter)', () => {

        //     let freshNews: News[];
        //     let alreadyLoadedNews: News[];

        //     beforeEach(() => {
        //         alreadyLoadedNews = <News[]>[ { title: 'Notícia A' }, { title: 'Notícia B' }];
        //         freshNews = <News[]>[ { title: 'Notícia C' }, { title: 'Notícia D' }];
        //         sandbox.stub( newsApiService, 'getNews' ).returnsPromise().resolves( freshNews );

        //         // configure controller
        //         controller.news = alreadyLoadedNews;
        //         controller.filter = {
        //             origins: [ 'SESA', 'SECOM' ],
        //             dateMin: new Date(),
        //             dateMax: new Date()
        //         };
        //         controller.pagination = {
        //             pageNumber: 5,
        //             pageSize: 12
        //         };
        //     });

        //     it( 'should append returned news to existing news list if paginating', () => {
        //         controller.getNews( controller.filter, controller.pagination );

        //         expect( controller.news ).to.deep.equal( alreadyLoadedNews.concat( freshNews ) );
        //     });

        //     it( 'should replace existing news with freshing ones if is not paginating', () => {
        //         controller.pagination.pageNumber = 1; // not paginating

        //         controller.getNews( controller.filter, controller.pagination );

        //         expect( controller.news ).to.deep.equal( freshNews );
        //     });

        //     it( 'should unset hasMoreNews if returned a partial page list', () => {
        //         controller.hasMoreNews = true;
        //         controller.pagination.pageSize = 10; // freshNews.length < pagination.pageSize

        //         controller.getNews( controller.filter, controller.pagination );

        //         expect( controller.hasMoreNews ).to.be.false;
        //     });

        //     it( 'should set hasMoreNews if returned a full page list', () => {
        //         controller.hasMoreNews = false;
        //         controller.pagination.pageSize = 2; // pageSize == freshNews.length

        //         controller.getNews( controller.filter, controller.pagination );

        //         expect( controller.hasMoreNews ).to.be.true;
        //     });

        //     it( 'should broadcast scroll.infiniteScrollComplete event', () => {
        //         let $broadcast = sandbox.spy( environment.$scope, '$broadcast' );

        //         controller.getNews( controller.filter, controller.pagination );

        //         expect( $broadcast.called ).to.be.true;
        //     });
        // });

        describe( 'Filters:', () => {
            let $mdDialogShow: Sinon.SinonStub;

            beforeEach(() => {
                $mdDialogShow = sandbox.stub( $mdDialogMock, 'show' );
                $mdDialogShow.returnsPromise();
            });

            describe( 'openOriginsFilter()', () => {

                it( 'should open sources filter', () => {
                    controller.availableOrigins = availableOrigins;
                    controller.filter.origins = availableOrigins;

                    controller.openOriginsFilter();

                    expect( $mdDialogShow.calledWithExactly( {
                        controller: SourcesFilterController,
                        template: sourcesFilterTemplate,
                        bindToController: true,
                        controllerAs: 'vm',
                        locals: {
                            availableOrigins: controller.availableOrigins,
                            selectedOrigins: controller.filter.origins
                        }
                    }) ).to.be.true;
                });

                describe.skip( 'on sources filter edited:', () => {
                    it( 'should apply user inputted filter', () => {
                        let sourceFilter = {
                            origins: [ 'SEDU' ],
                            dateMin: undefined,
                            dateMax: undefined
                        };
                        $mdDialogShow.returnsPromise().resolves( sourceFilter );
                        let applyUserFilter = sandbox.stub( controller, 'applyUserFilter' );

                        controller.openOriginsFilter();

                        expect( applyUserFilter.calledWith( sourceFilter ) ).to.be.true;
                    });
                });
            });


            describe( 'openDateFilter()', () => {
                it( 'should open dates filter', () => {
                    controller.filter.dateMin = moment().subtract( 1, 'day' ).toDate();
                    controller.filter.dateMax = moment().add( 1, 'day' ).toDate();

                    controller.openDateFilter();

                    expect( $mdDialogShow.calledWithExactly( {
                        controller: DatesFilterController,
                        template: datesFilterTemplate,
                        bindToController: true,
                        controllerAs: 'vm',
                        locals: {
                            dateMin: controller.filter.dateMin,
                            dateMax: controller.filter.dateMax
                        }
                    }) ).to.be.true;
                });

                describe.skip( 'on dates filter edited:', () => {
                    it( 'should apply user inputted filter', () => {
                        let dateFilter = {
                            dateMin: moment().subtract( 10, 'day' ).toDate(),
                            dateMax: moment().add( 10, 'day' ).toDate()
                        };
                        $mdDialogShow.returnsPromise().resolves( dateFilter );
                        let applyUserFilter = sandbox.stub( controller, 'applyUserFilter' );

                        controller.openDateFilter();

                        expect( applyUserFilter.calledWith( dateFilter ) ).to.be.true;
                    });
                });
            });
        });

        describe( 'goToNews( id )', () => {
            it( 'should show selected news', () => {
                let changeState = sandbox.stub( transitionService, 'changeState' );
                let id = '123456';

                controller.goToNews( id );

                expect( changeState.calledWith( 'app.news/:id', { id: id }, { type: 'slide', direction: 'left' }) ).to.be.true;
            });
        });

        describe.skip( 'doFilter(filter)', () => {

            let getNews: Sinon.SinonStub;
            let userFilter: Filter = { origins: [ 'PRODEST' ] };
            beforeEach(() => {
                getNews = sandbox.stub( controller, 'getNews' );
                controller.pagination = { pageNumber: 3 };
                controller.filter = { origins: [ 'SESA', 'SEFAZ' ] };

                controller.doFilter( userFilter );
            });

            it( 'should reset pagination to first page', () => {
                expect( controller.pagination.pageNumber ).to.be.equal( 1 );
            });

            it( 'should update filter with user provided values', () => {
                expect( controller.filter ).to.be.deep.equal( userFilter );
            });

            it( 'should get news passing controller filter and pagination', () => {
                expect( getNews.calledWith( controller.filter, controller.pagination ) ).to.be.true;
            });
        });

        describe( 'isFirstPage', () => {
            it( 'should return true if current page === 1', () => {
                controller.pagination.pageNumber = 1;
                expect( controller.isFirstPage ).to.be.true;
            });

            it( 'should return false if current page > 1', () => {
                controller.pagination.pageNumber = 2;
                expect( controller.isFirstPage ).to.be.false;
            });
        });

        describe.skip( 'doPaginate()', () => {

            let getNews: Sinon.SinonStub;
            beforeEach(() => {
                getNews = sandbox.stub( controller, 'getNews' );
                controller.filter = { origins: [ 'SECOM' ] };
                controller.pagination = { pageNumber: 3 };
            });

            it( 'should not increment page number if there are no news loaded (first load)', () => {
                controller.news = [];

                controller.doPaginate();

                expect( controller.pagination.pageNumber ).to.be.equal( 3 );
            });

            it( 'should increment page number if any news already loaded', () => {
                controller.news = <News[]>[ {}, {}, {}];

                controller.doPaginate();

                expect( controller.pagination.pageNumber ).to.be.equal( 4 );
            });

            it( 'should get news with filter and pagination', () => {
                controller.doPaginate();

                expect( getNews.calledWith( controller.filter, controller.pagination ) ).to.be.true;
            });
        });
    });

    describe( 'Component', () => {
        // test the component/directive itself
        let component = NewsListComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( NewsListController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( NewsListTemplate );
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
