import { NewsHighlightsController } from './news-highlights.component.controller';
import { NewsApiService, News } from '../shared/index';
import { NewsHighlightsComponent } from './news-highlights.component';
import NewsHighlightsTemplate = require( './news-highlights.component.html' );
import { environment } from '../../shared/tests/index';
import { TransitionService } from '../../shared/shared.module';

let expect = chai.expect;

describe( 'News/news-highlights', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: NewsHighlightsController;
        let newsApiService: NewsApiService;
        let highlights: News[] = <News[]>[ { title: 'Notícia A', id: '1111111' }, { title: 'Notícia B', id: '222222' }];
        let transitionService: TransitionService;

        beforeEach(() => {
            environment.refresh();
            newsApiService = <NewsApiService><any>{ getHighlightNews: () => { } };
            sandbox.stub( newsApiService, 'getHighlightNews' ).returnsPromise().resolves( highlights );
            transitionService = <TransitionService><any>{ changeState: () => { } };

            controller = new NewsHighlightsController( environment.$scope, newsApiService, transitionService );
        });

        describe( 'on instantiation', () => {

            it( 'should have a empty highlights', () => {
                expect( controller.highlights ).to.be.not.undefined;
                expect( controller.highlights ).to.be.empty;
            });

            it( 'should activate on $ionicView.beforeEnter event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                environment.onIonicBeforeEnterEvent();

                expect( activate.called ).to.be.true;
            });
        });

        describe( 'activate()', () => {
            it( 'should call getHighlightNews', async () => {
                await controller.activate();

                expect( controller.highlights ).to.deep.equal( highlights );
            });
        });


        describe( 'goToNews( id )', () => {
            it( 'should show highlight news', () => {
                let changeState = sandbox.stub( transitionService, 'changeState' );
                let id = '123456';

                controller.goToNews( id );

                expect( changeState.calledWith( 'app.news/:id', { id: id }, { type: 'slide', direction: 'left' }) ).to.be.true;
            });
        });
    });

    describe( 'Component', () => {
        // test the component/directive itself
        let component = NewsHighlightsComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( NewsHighlightsController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( NewsHighlightsTemplate );
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
