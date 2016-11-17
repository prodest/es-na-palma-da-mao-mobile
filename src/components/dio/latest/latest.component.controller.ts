import { IScope, IWindowService } from 'angular';
import { Edition, DioApiService } from '../shared/index';

export class LatestController {

    public static $inject: string[] = [
        '$scope',
        '$window',
        'dioApiService'
    ];

    public latestEditions: Edition[] = [];

    /**
     * Creates an instance of LatestController.
     * 
     * @param {IScope} $scope
     * @param {IWindowService} $window
     * @param {DioApiService} dioApiService
     */
    constructor( private $scope: IScope,
        private $window: IWindowService,
        private dioApiService: DioApiService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }

    /**
     * Ativa o controller
     */
    public async activate() {
        this.latestEditions = await this.dioApiService.getLatestEditions();
    }


    /**
     * 
     * 
     * @param {string} url
     */
    public openEdition( url: string ): void {
        this.$window.open( url, '_system' );
    }
}
