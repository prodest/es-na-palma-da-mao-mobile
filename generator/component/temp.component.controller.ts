import { IScope } from 'angular';

export class <%= className %>Controller {

    public static $inject: string[] = [ '$scope' ];

    public name: string;

    /**
     * Creates an instance of <%= className %>Controller.
     * 
     * @param {IScope} $scope
     * 
     * @memberOf <%= className %>Controller
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
        this.name = '<%= fileName %> component';
    }
}

