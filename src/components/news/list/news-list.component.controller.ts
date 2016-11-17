import { IScope } from 'angular';
import { SourcesFilterController, sourcesFilterTemplate } from '../../layout/sources-filter/index';
import datesFilterTemplate = require( './dates-filter/dates-filter.html' );
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
    }

    /**
     * Ativa o controller
     */
    public async activate() {
        await this.getAvailableOrigins();
        await this.getFirstPage();
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
    public async getAvailableOrigins() {
        this.availableOrigins = await this.newsApiService.getAvailableOrigins() || [];
        this.filter.origins = this.filter.origins || angular.copy( this.availableOrigins );
    }

    /**
    * 
    * 
    * @returns {Promise<News[]>}
    * 
    * @memberOf NewsListController
    */
    private async getFirstPage(): Promise<News[]> {
        this.hasMoreNews = true;
        this.pagination.pageNumber = 1;
        return await this.getNews( this.filter, this.pagination );
    }

    /**
     * Obtém uma lista de notícias
     */
    private async getNews( filter: Filter, pagination: Pagination ): Promise<News[]> {
        const nextNews = await this.newsApiService.getNews( filter, pagination );

        // Check whether it has reached the end
        this.hasMoreNews = nextNews.length >= this.pagination.pageSize;
        this.news = this.isFirstPage ? nextNews : this.news!.concat( nextNews );

        // increment page for the next query
        this.pagination.pageNumber += 1;

        return nextNews;
    }

    /**
     * 
     * 
     * 
     * @memberOf NewsListController
     */
    public async doPaginate(): Promise<News[]> {
        try {
            return await this.getNews( this.filter, this.pagination );
        } finally {
            this.$scope.$broadcast( 'scroll.infiniteScrollComplete' );
        }
    }

    /**
     * 
     * 
     * @param {any} filter
     * 
     * @memberOf NewsListController
     */
    public async doFilter( filter ): Promise<News[]> {
        Object.assign( this.filter, filter );
        return await this.getFirstPage();
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
    public async openOriginsFilter() {
        const options = {
            controller: SourcesFilterController,
            template: sourcesFilterTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: {
                availableOrigins: this.availableOrigins,
                selectedOrigins: this.filter.origins
            }
        };

        const filter = await this.$mdDialog.show( options );
        await this.doFilter( filter );
    }

    /**
     * Abre o filtro (popup) por data
     */
    public async openDateFilter() {
        const options = {
            controller: DatesFilterController,
            template: datesFilterTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: {
                dateMin: this.filter.dateMin,
                dateMax: this.filter.dateMax
            }
        };

        const filter = await this.$mdDialog.show( options );
        await this.doFilter( filter );
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

