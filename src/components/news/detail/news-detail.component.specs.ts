import { NewsDetailController } from './news-detail.component.controller';
import { NewsApiService, News, NewsDetail } from '../shared/index';
import NewsDetailComponent from './news-detail.component';
import NewsDetailTemplate = require( './news-detail.component.html' );
import { environment, $stateMock } from '../../shared/tests/index';
import { SocialSharing } from 'ionic-native';

let expect = chai.expect;

describe( 'News/news-detail', () => {

    let sandbox: Sinon.SinonSandbox;
    beforeEach(() => sandbox = sinon.sandbox.create() );
    afterEach(() => sandbox.restore() );

    describe( 'Controller', () => {
        let controller: NewsDetailController;
        let newsApiService: NewsApiService;
        let news: News = <News>{ title: 'Notícia A', id: '1234456' };

        beforeEach(() => {
            environment.refresh();
            newsApiService = <NewsApiService><any>{ getNewsById: () => { } };
            sandbox.stub( newsApiService, 'getNewsById' ).returnsPromise().resolves( news );

            controller = new NewsDetailController( environment.$scope, newsApiService, $stateMock );
        });

        describe( 'on instantiation', () => {

            it( 'should have a empty news', () => {
                expect( controller.news ).to.be.empty;
            });

            it( 'should activate on $ionicView.beforeEnter event', () => {
                let activate = sandbox.stub( controller, 'activate' ); // replace original activate

                // simulates ionic before event trigger
                environment.onIonicBeforeEnterEvent();

                expect( activate.called ).to.be.true;
            });
        });

        describe( 'activate()', () => {
            it( 'should call getNewsById', async () => {
                await controller.activate();

                expect( controller.news ).to.deep.equal( news );
            });
        });


        describe( 'share( news )', () => {
            it( 'should share news title, img and url', () => {
                let shareWithOptions = sandbox.stub( SocialSharing, 'shareWithOptions' );
                let newsDetail = <NewsDetail><any>{
                    title: 'News title',
                    subject: 'News title',
                    image: 'image',
                    url: 'url'
                };

                controller.share( newsDetail );

                expect( shareWithOptions.calledWithExactly( {
                    message: newsDetail.title,
                    subject: newsDetail.title,
                    // files: [ newsDetail.image ],
                    url: newsDetail.url
                }) ).to.be.true;
            });
        });
    });

    describe( 'Component', () => {
        // test the component/directive itself
        let component = NewsDetailComponent();

        it( 'should use the right controller', () => {
            expect( component.controller ).to.equal( NewsDetailController );
        });

        it( 'should use the right template', () => {
            expect( component.template ).to.equal( NewsDetailTemplate );
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
