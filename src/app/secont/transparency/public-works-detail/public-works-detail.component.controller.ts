import { IScope } from 'angular';
import { PublicWorksDetail, TransparencyApiService } from '../shared/index';

export class PublicWorksDetailController {

    public static $inject: string[] = [ '$scope', '$stateParams', 'transparencyApiService' ];

    public detail: PublicWorksDetail | undefined;

    /**
     * Creates an instance of PublicWorksDetailController.
     * 
     * @param {IScope} $scope
     * @param {angular.ui.IStateParamsService} $stateParams
     * @param {TransparencyApiService} transparencyApiService
     * 
     * @memberOf PublicWorksDetailController
     */
    constructor( private $scope: IScope,
        private $stateParams: angular.ui.IStateParamsService,
        private transparencyApiService: TransparencyApiService ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }


    /**
     * Ativa o componente
     *
     * @returns {void}
     */
    public async activate() {
        const { id } = this.$stateParams;
        await this.getPublicWorkDetail( id );
    }

    /**
     * 
     * 
     * @param {number} id
     * 
     * @memberOf PublicWorksDetailController
     */
    public async getPublicWorkDetail( id: number ) {
        try {
            this.detail = await this.transparencyApiService.getPublicWorksDetail( id );
        } catch ( error ) {
            this.detail = undefined;
        }
    }
}
