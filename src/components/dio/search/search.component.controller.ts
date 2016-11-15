import { IScope, IWindowService } from 'angular';
import { SocialSharing } from 'ionic-native';

import filterTemplate = require( './filter/filter.html' );
import { FilterController } from './filter/filter.controller';
import {
    SearchFilter,
    SearchResult,
    Hit,
    DioApiService
} from '../shared/index';


export class SearchController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        '$mdDialog',
        'dioApiService'
    ];

    public lastQuery: string | undefined;
    public hits: Hit[] | undefined;
    public searched = false;
    public hasMoreHits = false;
    public totalHits: number = 0;
    public filter: SearchFilter = {
        pageNumber: 0,
        sort: 'date'
    };


    /**
     * Creates an instance of SearchController.
     * 
     * @param {IScope} $scope
     * @param {IWindowService} $window
     * @param {angular.material.IDialogService} $mdDialog
     * @param {DioApiService} dioApiService
     */
    constructor( private $scope: IScope,
        private $window: IWindowService,
        private $mdDialog: angular.material.IDialogService,
        private dioApiService: DioApiService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }


    /**
     * Ativa o controller
     */
    public activate(): void {
        angular.element( document.querySelectorAll( 'ion-header-bar' ) ).removeClass( 'espm-header-tabs' );
    }

    /**
    * 
    * 
    * @param {string} link
    * 
    * @memberOf NewsDetailController
    */
    public share( hit: Hit ): void {
        SocialSharing.shareWithOptions( {
            message: `DIO ES - ${hit.date} - Pág. ${hit.pageNumber}`,
            subject: `DIO ES - ${hit.date} - Pág. ${hit.pageNumber}`,
            url: hit.pageUrl
        });
    }

    /**
     * Abre o filtro (popup) por data
     */
    public async openFilter() {
        const options = {
            controller: FilterController,
            template: filterTemplate,
            bindToController: true,
            controllerAs: 'vm',
            locals: this.filter
        };
        const filter = await this.$mdDialog.show( options );
        filter.pageNumber = 0;
        this.search( filter );
    }

    /**
     * 
     * 
     * @param {SearchFilter} options
     * @returns {Promise<SearchResult[]>}
     */
    public async search( filter: SearchFilter ) {
        Object.assign( this.filter, filter || {}); // atualiza o filtro

        try {
            const nextResults = await this.dioApiService.search( this.filter );
            this.onSearchSuccess( nextResults );
        } catch ( error ) {
            this.hits = undefined;
            this.hasMoreHits = false;
            this.lastQuery = undefined;
            this.totalHits = 0;
        }
        finally {
            this.searched = true;
            this.$scope.$broadcast( 'scroll.infiniteScrollComplete' );
        };
    }

    /**
     * 
     * 
     * @private
     * @param {SearchResult} nextResults
     * @returns
     * 
     * @memberOf SearchController
     */
    private onSearchSuccess( nextResults: SearchResult ) {
        if ( this.filter.pageNumber === 0 ) {
            this.hits = [];
        }
        this.totalHits = nextResults.totalHits;
        this.hits = this.hits!.concat( nextResults.hits );
        this.hasMoreHits = nextResults.hits && nextResults.hits.length > 0;
        this.lastQuery = angular.copy( this.filter.query );
    };

    /**
    * 
    * 
    * @param {string} url
    */
    public open( url: string ): void {
        this.$window.open( url, '_system' );
    }
}
