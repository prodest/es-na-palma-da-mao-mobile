import { IScope } from 'angular';
import { SocialSharing } from 'ionic-native';
import { NewsDetail, NewsApiService } from '../shared/index';

export class NewsDetailController {

    public static $inject: string[] = [ '$scope', 'newsApiService', '$stateParams' ];

    public news: NewsDetail;

    /**
     * Creates an instance of NewsDetailController.
     * 
     * @param {IScope} $scope
     * @param {NewsApiService} newsApiService
     * @param {angular.ui.IStateParamsService} $stateParams
     */
    constructor( private $scope: IScope,
        private newsApiService: NewsApiService,
        private $stateParams: angular.ui.IStateParamsService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }


    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public async activate() {
        this.news = await this.newsApiService.getNewsById( this.$stateParams[ 'id' ] );
    }

    /**
     * 
     * 
     * @param {string} link
     * 
     * @memberOf NewsDetailController
     */
    public share( news: NewsDetail ): void {
        let shareOptions = {
            message: news.title,
            subject: news.title,
            url: news.url
        };

        SocialSharing.shareWithOptions( shareOptions );
    }
}
