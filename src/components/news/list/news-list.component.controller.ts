import { IScope, IPromise } from 'angular';
import { SourcesFilterController, sourcesFilterTemplate } from '../../layout/sources-filter/index';
import datesFilterTemplate = require('./dates-filter/dates-filter.html');
import { DatesFilterController } from './dates-filter/dates-filter.controller';
import { News, NewsApiService, Filter, Pagination } from '../shared/index';
import { TransitionService } from '../../shared/index';

export class NewsListController {

    public static $inject: string[] = [
        '$scope',
        '$mdDialog',
        'newsApiService',
        'transitionService'
    ];

    public availableOrigins: string[] | undefined;
    public news: News[] | undefined;
    public hasMoreNews = true;
    public filter: Filter = {};
    public pagination: Pagination = {
        pageNumber: 1,
        pageSize: 10
    };

    /**
     * Creates an instance of NewsListController.
     * 
     * @param {IScope} $scope
     * @param {angular.material.IDialogService} $mdDialog
     * @param {NewsApiService} newsApiService
     * @param {TransitionService} transitionService
     * 
     * @memberOf NewsListController
     */
    constructor( private $scope: IScope,
        private $mdDialog: angular.material.IDialogService,
        private newsApiService: NewsApiService,
        private transitionService: TransitionService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
        this.$scope.$on( '$ionicView.beforeEnter', () => angular.element( document.querySelectorAll( 'ion-header-bar' ) ).removeClass( 'espm-header-tabs' ) );
    }

    /**
     * Ativa o controller
     */
    public activate(): void {
        this.getAvailableOrigins()
            .then(() => this.getFirstPage() );
    }

    /**
     * 
     * 
     * @readonly
     * @type {boolean}
     * @memberOf NewsListController
     */
    public get activated(): boolean {
        return !!this.availableOrigins && !!this.news;
    }

    /**
     * Carrega lista de origins disponíveis
     *
     * @returns {*}
     */
    public getAvailableOrigins(): IPromise<string[]> {
        return this.newsApiService.getAvailableOrigins()
            .then( origins => {
                this.availableOrigins = origins || [];
                this.filter.origins = this.filter.origins || angular.copy( this.availableOrigins );
                return origins;
            });
    }

    /**
     * Obtém uma lista de notícias
     */
    private getNews( filter: Filter, pagination: Pagination ): IPromise<News[]> {
        return this.newsApiService.getNews( filter, pagination )
            .then( nextNews => {
                // Check whether it has reached the end
                this.hasMoreNews = nextNews.length >= this.pagination.pageSize;
                this.news = this.isFirstPage ? nextNews : this.news!.concat( nextNews );

                // increment page for the next query
                this.pagination.pageNumber += 1;

                return nextNews;
            });
    }

    /**
     * 
     * 
     * 
     * @memberOf NewsListController
     */
    public doPaginate(): IPromise<News[]> {
        return this.getNews( this.filter, this.pagination )
            .then( nextNews => {
                this.$scope.$broadcast( 'scroll.infiniteScrollComplete' );
                return nextNews;
            });
    }

    /**
     * 
     * 
     * @param {any} filter
     * 
     * @memberOf NewsListController
     */
    public doFilter( filter ): IPromise<News[]> {
        angular.extend( this.filter, filter );
        return this.getFirstPage();
    }

    /**
    * 
    * 
    * @returns {IPromise<News[]>}
    * 
    * @memberOf NewsListController
    */
    private getFirstPage(): IPromise<News[]> {
        this.hasMoreNews = true;
        this.pagination.pageNumber = 1;
        return this.getNews( this.filter, this.pagination );
    }

    /**
     * 
     * 
     * @readonly
     * 
     * @memberOf NewsListController
     */
    public get isFirstPage() {
        return this.pagination.pageNumber === 1;
    }

    /**
     * Abre filtro(popup) por fonte da notícia
     */
    public openOriginsFilter(): void {
        this.$mdDialog.show( {
            controller: SourcesFilterController,
            template: sourcesFilterTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: {
                availableOrigins: this.availableOrigins,
                selectedOrigins: this.filter.origins
            }
        })
            .then( filter => this.doFilter( filter ) );
    }

    /**
     * Abre o filtro (popup) por data
     */
    public openDateFilter(): void {
        this.$mdDialog.show( {
            controller: DatesFilterController,
            template: datesFilterTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: {
                dateMin: this.filter.dateMin,
                dateMax: this.filter.dateMax
            }
        })
            .then( filter => this.doFilter( filter ) );
    }



    /**
    * Navega para um notícia
    * 
    * @param {string} id
    */
    public goToNews( id: string ): void {
        this.transitionService.changeState( 'app.news/:id', { id: id }, { type: 'slide', direction: 'left' });
    }
}

