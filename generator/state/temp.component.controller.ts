import { IScope } from 'angular';

export class <%= upCaseName %>Controller {

    public static $inject: string[] = [ '$scope' ];

    public name: string;

    /**
     * Creates an instance of <%= upCaseName %>Controller.
     * 
     * @param {IScope} $scope
     * 
     * @memberOf <%= upCaseName %>Controller
     */
    constructor( private $scope: IScope ) {
        this.$scope.$on( '$ionicView.loaded', () => this.activate() );
    }


    /**
     * Ativa o component
     *
     * @returns {void}
     */
    public activate() {
        this.name = '<%= upCaseName %> state';
    }
}

